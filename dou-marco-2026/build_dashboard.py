from __future__ import annotations

import json
import re
import statistics
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path


SOURCE_DIR = Path("/Users/viniciusgushiken/Downloads/S01032026")
OUT_DIR = Path(__file__).resolve().parent


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        if data.strip():
            self.parts.append(data.strip())

    def text(self) -> str:
        return re.sub(r"\s+", " ", " ".join(self.parts)).strip()


def html_to_text(html: str) -> str:
    parser = TextExtractor()
    parser.feed(html or "")
    return parser.text()


def first_nonempty(*values: str | None) -> str:
    for value in values:
        if value and value.strip():
            return re.sub(r"\s+", " ", value).strip()
    return ""


def split_category(category: str) -> tuple[str, str]:
    parts = [part.strip() for part in category.split("/") if part.strip()]
    if not parts:
        return "Sem órgão", "Sem subórgão"
    return parts[0], parts[1] if len(parts) > 1 else parts[0]


THEME_RULES = [
    ("Retificações", [r"\bretifica", r"onde se lê", r"leia-se"]),
    ("Alterações normativas", [r"\baltera", r"\balterar", r"passa a vigorar", r"dá nova redação"]),
    ("Revogações", [r"\brevoga", r"fica revogad"]),
    ("Autorizações e concessões", [r"\bautoriza", r"\bconcede", r"\boutorga", r"\bhabilita", r"\bcredencia"]),
    ("Pessoal", [r"\bnomeia", r"\bexonera", r"\bdesigna", r"\bdispensa", r"\baposenta"]),
    ("Sanções e fiscalização", [r"\binterdita", r"\bsuspende", r"\bcancela", r"\bmulta", r"\bpenalidade"]),
    ("Contratos e convênios", [r"\bcontrato", r"\bconvênio", r"\bacordo", r"\btermo aditivo"]),
    ("Orçamento e finanças", [r"\borçament", r"\bcrédito", r"\bfinanceir", r"\btribut", r"\barrecada"]),
    ("Defesa civil", [r"defesa civil", r"situação de emergência", r"estado de calamidade"]),
]


DOMAIN_RULES = [
    ("Saúde e vigilância sanitária", [r"ministério da saúde", r"anvisa", r"vigilância sanitária"]),
    ("Transportes e infraestrutura", [r"transportes", r"antt", r"infraestrutura rodoviária", r"portos", r"aeroportos", r"antaq"]),
    ("Energia, petróleo e mineração", [r"minas e energia", r"petróleo", r"aneel", r"anm", r"biocombustíveis"]),
    ("Fazenda, receita e tributos", [r"fazenda", r"receita federal", r"carf", r"tribut"]),
    ("Comunicações", [r"comunicações", r"anatel", r"radiodifusão"]),
    ("Integração regional e defesa civil", [r"integração e do desenvolvimento regional", r"defesa civil"]),
    ("Educação, cultura e esporte", [r"educação", r"cultura", r"esporte", r"mec", r"minc"]),
    ("Meio ambiente", [r"meio ambiente", r"ibama", r"icmbio"]),
    ("Justiça e segurança", [r"justiça", r"segurança pública", r"polícia", r"defesa"]),
    ("Trabalho e previdência", [r"trabalho", r"previdência", r"inss"]),
]


def classify(text: str, art_type: str, category: str, rules: list[tuple[str, list[str]]], fallback: str) -> str:
    haystack = f"{art_type} {category} {text}".lower()
    for label, patterns in rules:
        if any(re.search(pattern, haystack) for pattern in patterns):
            return label
    return fallback


def extract_old_new(text: str) -> list[dict[str, str]]:
    changes: list[dict[str, str]] = []
    pattern = re.compile(
        r'onde se lê:?\s*["“]?(.{5,650}?)[”"]?\s*(?:,|\.)?\s*leia-se:?\s*["“]?(.{5,650}?)(?=(?:[”"]?\s*(?:\.|;|$)))',
        re.IGNORECASE,
    )
    for match in pattern.finditer(text):
        old, new = match.group(1).strip(" .;:\"“”"), match.group(2).strip(" .;:\"“”")
        if old and new and old != new:
            changes.append({"old": old, "new": new})
    return changes[:5]


def make_summary(text: str, title: str, limit: int = 330) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if title and text.lower().startswith(title.lower()):
        text = text[len(title) :].strip(" .-")
    if len(text) <= limit:
        return text
    cut = text[:limit].rsplit(" ", 1)[0]
    return f"{cut}..."


def parse_article(path: Path) -> dict[str, object]:
    article = ET.parse(path).getroot().find("article")
    if article is None:
        raise ValueError(f"Sem article: {path}")
    attrs = article.attrib
    body = article.find("body")
    get = body.findtext if body is not None else lambda _name: ""
    raw_text = get("Texto") or ""
    text = html_to_text(raw_text)
    identifica = html_to_text(get("Identifica") or "")
    titulo = html_to_text(get("Titulo") or "")
    ementa = html_to_text(get("Ementa") or "")
    display_title = first_nonempty(titulo, ementa, identifica, attrs.get("name"), attrs.get("artType"))
    category = attrs.get("artCategory", "")
    ministry, unit = split_category(category)
    art_type = attrs.get("artType", "Sem tipo")
    pub_date = attrs.get("pubDate", "")
    iso_date = datetime.strptime(pub_date, "%d/%m/%Y").date().isoformat()
    return {
        "id": attrs.get("idMateria") or attrs.get("id"),
        "file": path.name,
        "date": pub_date,
        "isoDate": iso_date,
        "edition": attrs.get("editionNumber", ""),
        "section": attrs.get("pubName", ""),
        "page": attrs.get("numberPage", ""),
        "pdf": (attrs.get("pdfPage") or "").replace("&amp;", "&"),
        "type": art_type,
        "title": display_title,
        "summary": make_summary(text, display_title),
        "ministry": ministry,
        "unit": unit,
        "category": category,
        "theme": classify(text, art_type, category, THEME_RULES, "Outros atos"),
        "domain": classify(text, art_type, category, DOMAIN_RULES, "Administração pública e demais temas"),
        "oldNew": extract_old_new(text),
        "text": text[:2500],
    }


def main() -> None:
    records = [parse_article(path) for path in sorted(SOURCE_DIR.glob("*.xml"))]
    records.sort(key=lambda item: (item["isoDate"], item["ministry"], item["type"], item["title"]))

    by_date = Counter(record["date"] for record in records)
    by_theme = Counter(record["theme"] for record in records)
    by_domain = Counter(record["domain"] for record in records)
    by_type = Counter(record["type"] for record in records)
    by_ministry = Counter(record["ministry"] for record in records)
    dates = sorted(by_date, key=lambda value: datetime.strptime(value, "%d/%m/%Y"))
    daily_counts = [{"date": date, "count": by_date[date]} for date in dates]
    top_ministries = [{"name": name, "count": count} for name, count in by_ministry.most_common(14)]
    top_types = [{"name": name, "count": count} for name, count in by_type.most_common(14)]
    top_domains = [{"name": name, "count": count} for name, count in by_domain.most_common()]
    themes = [{"name": name, "count": count} for name, count in by_theme.most_common()]

    day_values = list(by_date.values())
    meta = {
        "sourceDir": str(SOURCE_DIR),
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "total": len(records),
        "dateStart": dates[0],
        "dateEnd": dates[-1],
        "dailyAverage": round(statistics.mean(day_values), 1),
        "dailyMax": max(daily_counts, key=lambda item: item["count"]),
        "retificationsWithPairs": sum(bool(record["oldNew"]) for record in records),
        "sections": Counter(record["section"] for record in records),
    }

    payload = {
        "meta": meta,
        "dailyCounts": daily_counts,
        "themes": themes,
        "domains": top_domains,
        "ministries": top_ministries,
        "types": top_types,
        "records": records,
    }

    (OUT_DIR / "data.json").write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    main()
