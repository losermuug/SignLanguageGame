from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


OUT = Path("performance_efficiency_report.pdf")

FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

pdfmetrics.registerFont(TTFont("Arial", FONT_REGULAR))
pdfmetrics.registerFont(TTFont("Arial-Bold", FONT_BOLD))


PAGE_W, PAGE_H = A4
MARGIN = 15 * mm
GAP = 7 * mm
COL_W = (PAGE_W - 2 * MARGIN - GAP) / 2

NAVY = colors.HexColor("#123047")
TEAL = colors.HexColor("#0E7C7B")
GOLD = colors.HexColor("#D7972A")
LIGHT = colors.HexColor("#F4F7F8")
LINE = colors.HexColor("#D8E1E5")
INK = colors.HexColor("#1F2933")
MUTED = colors.HexColor("#536471")


styles = {
    "title": ParagraphStyle(
        "title",
        fontName="Arial-Bold",
        fontSize=17,
        leading=20,
        textColor=colors.white,
        alignment=TA_CENTER,
        spaceAfter=2,
    ),
    "subtitle": ParagraphStyle(
        "subtitle",
        fontName="Arial",
        fontSize=8.5,
        leading=10.5,
        textColor=colors.HexColor("#EAF2F4"),
        alignment=TA_CENTER,
    ),
    "section": ParagraphStyle(
        "section",
        fontName="Arial-Bold",
        fontSize=9.3,
        leading=10.8,
        textColor=NAVY,
        spaceBefore=4,
        spaceAfter=2,
    ),
    "body": ParagraphStyle(
        "body",
        fontName="Arial",
        fontSize=7.45,
        leading=8.75,
        textColor=INK,
        alignment=TA_JUSTIFY,
        spaceAfter=2.3,
    ),
    "small": ParagraphStyle(
        "small",
        fontName="Arial",
        fontSize=6.85,
        leading=8.0,
        textColor=INK,
        alignment=TA_LEFT,
    ),
    "small_bold": ParagraphStyle(
        "small_bold",
        fontName="Arial-Bold",
        fontSize=6.95,
        leading=8.1,
        textColor=INK,
        alignment=TA_LEFT,
    ),
    "foot": ParagraphStyle(
        "foot",
        fontName="Arial",
        fontSize=6.0,
        leading=7.0,
        textColor=MUTED,
        alignment=TA_CENTER,
    ),
}


def p(text, style="body"):
    return Paragraph(text, styles[style])


def draw_round_box(c, x, y, w, h, fill=LIGHT, stroke=LINE, radius=5):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.roundRect(x, y, w, h, radius, stroke=1, fill=1)


def draw_header(c):
    header_h = 26 * mm
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - header_h, PAGE_W, header_h, stroke=0, fill=1)
    c.setFillColor(TEAL)
    c.rect(0, PAGE_H - header_h, PAGE_W, 2.5 * mm, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.rect(0, PAGE_H - header_h, 44 * mm, 2.5 * mm, stroke=0, fill=1)
    title = p("Гүйцэтгэлийн үр ашигтай байдал", "title")
    subtitle = p(
        "Хугацааны төлөв байдал (Time Behaviour) | Бие даалтын нэг нүүрийн тайлан | Г. Мөнхзул (23B1NUM0466)",
        "subtitle",
    )
    title.wrapOn(c, PAGE_W, header_h)
    subtitle.wrapOn(c, PAGE_W, header_h)
    title.drawOn(c, 0, PAGE_H - 15.5 * mm)
    subtitle.drawOn(c, 0, PAGE_H - 21.8 * mm)


def draw_para(c, para, x, y, w):
    aw, ah = para.wrap(w, 10_000)
    para.drawOn(c, x, y - ah)
    return y - ah


def draw_elements(c, elements, x, y, w):
    for kind, payload in elements:
        if kind == "section":
            c.setFillColor(TEAL)
            c.roundRect(x, y - 11, 4, 10, 1.5, stroke=0, fill=1)
            y = draw_para(c, p(payload, "section"), x + 7, y, w - 7) - 1
        elif kind == "para":
            y = draw_para(c, p(payload, "body"), x, y, w)
        elif kind == "small":
            y = draw_para(c, p(payload, "small"), x, y, w)
        elif kind == "box":
            title, body = payload
            title_p = p(title, "small_bold")
            body_p = p(body, "small")
            _, th = title_p.wrap(w - 12, 10_000)
            _, bh = body_p.wrap(w - 12, 10_000)
            h = th + bh + 10
            draw_round_box(c, x, y - h, w, h, fill=colors.HexColor("#F7FAFA"))
            title_p.drawOn(c, x + 6, y - th - 4)
            body_p.drawOn(c, x + 6, y - th - bh - 5)
            y -= h + 4
        elif kind == "table":
            data, widths = payload
            table = Table(data, colWidths=[w * frac for frac in widths])
            table.setStyle(
                TableStyle(
                    [
                        ("FONTNAME", (0, 0), (-1, 0), "Arial-Bold"),
                        ("FONTNAME", (0, 1), (-1, -1), "Arial"),
                        ("FONTSIZE", (0, 0), (-1, -1), 6.35),
                        ("LEADING", (0, 0), (-1, -1), 7.4),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                        ("BACKGROUND", (0, 0), (-1, 0), TEAL),
                        ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#FBFCFC")),
                        ("GRID", (0, 0), (-1, -1), 0.25, LINE),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 3),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 3),
                        ("TOPPADDING", (0, 0), (-1, -1), 2),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                    ]
                )
            )
            _, h = table.wrap(w, 10_000)
            table.drawOn(c, x, y - h)
            y -= h + 4
    return y


def main():
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("Гүйцэтгэлийн үр ашигтай байдал - Time Behaviour")
    c.setFillColor(colors.white)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    draw_header(c)

    top = PAGE_H - 31 * mm
    bottom = MARGIN + 10 * mm
    c.setStrokeColor(LINE)
    c.line(PAGE_W / 2, bottom, PAGE_W / 2, top + 2)

    left = [
        ("section", "1. Утга ба стандартын хүрээ"),
        (
            "para",
            "ISO/IEC 25010 стандартын бүтээгдэхүүний чанарын загварт <b>гүйцэтгэлийн үр ашигтай байдал</b> нь систем "
            "өгөгдсөн нөхцөлд шаардлагатай ажиллагааг хэр хурдан, нөөцөө хэр зохистой ашиглан, ямар дээд хязгаартайгаар "
            "гүйцэтгэж байгааг үнэлдэг шинж юм. Функц зөв ажиллаж байсан ч хариу удаан, ачаалалд тогтворгүй бол хэрэглэгч "
            "тухайн системийг чанаргүй гэж мэдэрнэ.",
        ),
        (
            "table",
            (
                [
                    [p("Дэд шинж", "small_bold"), p("Юуг хэмжих вэ?", "small_bold")],
                    [p("Time behaviour", "small_bold"), p("Response time, latency, throughput, startup time.", "small")],
                    [p("Resource utilization", "small_bold"), p("CPU, memory, disk I/O, network bandwidth-ийн хэрэглээ.", "small")],
                    [p("Capacity", "small_bold"), p("Зэрэгцээ хэрэглэгч, transaction, хадгалалтын дээд хязгаар.", "small")],
                ],
                [0.34, 0.66],
            ),
        ),
        ("section", "2. Хариу өгөх хугацаа (Response Time)"),
        (
            "para",
            "Response time нь хэрэглэгч хүсэлт илгээсэн мөчөөс эхлэн систем үр дүнгээ буцаан харуулах хүртэлх нийт хугацаа. "
            "Энэ нь зөвхөн серверийн тооцоолол биш, сүлжээ, дараалал, өгөгдлийн сан, frontend rendering зэрэг олон үеийн нийлбэр юм.",
        ),
        (
            "box",
            (
                "Нийт response time-ийн задрал",
                "<b>Transport latency</b> - хүсэлт/хариу сүлжээгээр дамжих саатал. "
                "<b>Processing time</b> - сервер логик, өгөгдлийн сан, CPU/санах ойн ажлыг хийх хугацаа. "
                "<b>Queueing delay</b> - ачаалал ихсэх үед хүсэлт буферт хүлээх хугацаа.",
            ),
        ),
        (
            "para",
            "Дундаж хугацаа дангаараа бодит байдлыг нууж болно. P50 системийн ердийн төлөвийг, P95 ихэнх хэрэглэгчийн туршлагыг, "
            "P99 хамгийн удаан 1%-ийн эрсдэлийг харуулна. P99 өндөр байна гэдэг нь системийн тодорхой нөхцөлд гацах голомт байгааг илтгэнэ.",
        ),
        (
            "box",
            (
                "Энгийн загвар",
                "<b>Response time = network latency + queueing delay + processing time + rendering time.</b> "
                "Иймээс зөвхөн backend хурдан байх нь хангалтгүй. Frontend зурагдах, өгөгдөл ирэх, дараалалд хүлээх үе "
                "эцсийн хэрэглэгчийн мэдрэх хугацаанд бүгд ордог.",
            ),
        ),
        (
            "para",
            "Жишээлбэл P50 нь 120 ms, P95 нь 420 ms, P99 нь 1.8 s байвал системийн ихэнх хүсэлт боломжийн боловч "
            "ачаалалтай эсвэл тодорхой өгөгдөлтэй үед удаашрах ноцтой нөхцөл байна гэж тайлбарлана.",
        ),
        ("section", "3. Ачааллах хугацаа (Startup Time)"),
        (
            "para",
            "Startup time нь апп хаалттай эсвэл арын горимоос хэрэглэгч шууд ашиглахад бэлэн болох хүртэлх хугацаа. "
            "Мобайл болон вэб апп дээр энэ нь анхны сэтгэгдэл, хэрэглэгч үлдэх эсэхэд хүчтэй нөлөөлдөг.",
        ),
        (
            "table",
            (
                [
                    [p("Төлөв", "small_bold"), p("Тайлбар", "small_bold")],
                    [p("Cold start", "small_bold"), p("Процесс шинээр эхэлж, файл унших, объект үүсгэх тул хамгийн удаан.", "small")],
                    [p("Warm start", "small_bold"), p("Зарим нөөц санах ойд үлдсэн учраас cold start-аас хурдан.", "small")],
                    [p("Hot start", "small_bold"), p("Background-оос foreground руу шилжих тул хамгийн хурдан.", "small")],
                ],
                [0.28, 0.72],
            ),
        ),
        (
            "box",
            (
                "Startup хэмжих дараалал",
                "1) Аппыг бүрэн хааж cold start хэмжих. 2) Аппыг дахин нээж warm start хэмжих. "
                "3) Background-оос буцааж hot start хэмжих. 4) Дүнг төхөөрөмж, сүлжээ, кэшийн төлөвтэй хамт тэмдэглэх.",
            ),
        ),
    ]

    right = [
        ("section", "4. Хэмжүүрүүдийг салгаж ойлгох"),
        (
            "para",
            "Ачаалал болон хэрэглэгчийн орчин өөрчлөгдөхөд хугацааны үзүүлэлтүүд өөр өөр шалтгаанаар мууддаг. Тиймээс "
            "TTFB, FCP/FCB, TTI зэрэг хэмжүүрийг тусад нь хэмжих хэрэгтэй. TTFB серверийн анхны өгөгдөл ирэх хугацаа, "
            "FCP/FCB дэлгэц дээр анхны агуулга харагдах мөч, TTI хэрэглэгч системтэй саадгүй харилцах боломжтой болсон үеийг илэрхийлнэ.",
        ),
        (
            "table",
            (
                [
                    [p("Персентиль", "small_bold"), p("Тайлбар", "small_bold")],
                    [p("P50", "small_bold"), p("Хүсэлтийн 50% энэ хугацаанаас хурдан. Ердийн төлөв.", "small")],
                    [p("P90/P95", "small_bold"), p("Ихэнх хэрэглэгчийн мэдрэх гүйцэтгэл.", "small")],
                    [p("P99", "small_bold"), p("Хамгийн удаан 1%-ийг илрүүлж, tail latency-г бууруулахад хэрэглэнэ.", "small")],
                ],
                [0.30, 0.70],
            ),
        ),
        (
            "para",
            "Throughput буюу нэвтрүүлэх чадвар нь нэгж хугацаанд хэдэн хүсэлт эсвэл transaction боловсруулж байгааг харуулна. "
            "Latency багассан ч throughput хязгаарт хүрвэл дараалал үүсэж response time өснө. Тиймээс хугацаа, throughput, error rate-ийг хамтад нь харна.",
        ),
        ("section", "5. Тестлэлийн хэрэгслүүд"),
        (
            "para",
            "<b>Apache JMeter</b> нь GUI болон олон протоколын дэмжлэгтэй тул ерөнхий load test-д тохиромжтой. "
            "<b>k6</b> нь JavaScript скриптээр тест бичиж CI/CD-д хурдан нэгтгэдэг. <b>Locust</b> нь Python-оор бодит хэрэглэгчийн "
            "үйлдлийг дуурайлгана. <b>Gatling</b> нь олон зэрэгцээ хэрэглэгчийн өндөр ачааллыг үр ашигтай үүсгэж тайлан гаргадаг.",
        ),
        (
            "box",
            (
                "Тестийн гол төрлүүд",
                "<b>Load testing</b> - хэвийн ба оргил ачаалалд шалгах. "
                "<b>Stress testing</b> - системийн хугарах цэг, сэргэх чадварыг харах. "
                "<b>Scalability testing</b> - нөөц нэмэхэд гүйцэтгэл хэр өсөхийг хэмжих. "
                "<b>Spike testing</b> - огцом өсөлтийн үед response time, error rate-ийг ажиглах.",
            ),
        ),
        (
            "table",
            (
                [
                    [p("Асуудал", "small_bold"), p("Боломжит арга", "small_bold")],
                    [p("Давтамжтай уншилт", "small_bold"), p("Кэш, CDN, local storage ашиглах.", "small")],
                    [p("DB удаан", "small_bold"), p("Индекс, query optimization, pagination хийх.", "small")],
                    [p("Урт ажил", "small_bold"), p("Async queue, background job болгон салгах.", "small")],
                    [p("Frontend хүнд", "small_bold"), p("Bundle split, image compression, lazy loading хэрэглэх.", "small")],
                ],
                [0.35, 0.65],
            ),
        ),
        ("section", "6. Оновчлол ба дүгнэлт"),
        (
            "para",
            "Оновчлолыг таамгаар биш хэмжилтээр эхэлнэ. Давтамжтай өгөгдөлд кэш хэрэглэх, өгөгдлийн сангийн индексийг зөв тавих, "
            "удаан ажлыг асинхрон дараалалд шилжүүлэх, frontend bundle болон зургийн хэмжээг багасгах, cold/warm/hot start-ийг "
            "тусад нь баримтжуулах нь хугацааны төлөв байдлыг бодитоор сайжруулна.",
        ),
        (
            "para",
            "Performance requirement-ийг “хурдан байх” гэж ерөнхий бичихээс илүү <b>P95 response time 500 ms-аас бага</b>, "
            "<b>cold start 3 секундээс бага</b>, <b>алдааны хувь 1%-иас бага</b> гэх мэт хэмжигдэхүйц босготой тодорхойлбол "
            "тестлэх, сайжруулах ажил илүү бодитой болно.",
        ),
        (
            "box",
            (
                "Дүгнэлт",
                "Хугацааны төлөв байдал нь хэрэглэгч системийн чанарыг шууд мэдэрдэг хэсэг юм. Иймээс дундаж хугацаанд найдахгүй, "
                "P95/P99, startup-ийн үе шат, бодит хөтөч/төхөөрөмж, ачааллын нөхцөлийг хамтад нь хэмжсэнээр хурдан төдийгүй "
                "тогтвортой, таамаглаж болохуйц систем бүтээх боломжтой.",
            ),
        ),
    ]

    left_y = draw_elements(c, left, MARGIN, top, COL_W)
    right_y = draw_elements(c, right, MARGIN + COL_W + GAP, top, COL_W)
    if min(left_y, right_y) < bottom + 4 * mm:
        raise RuntimeError("Content overflow: reduce text or font size.")

    c.setStrokeColor(LINE)
    c.line(MARGIN, 16 * mm, PAGE_W - MARGIN, 16 * mm)
    footer = p(
        "Эх сурвалж: “Гүйцэтгэлийн үр ашигтай байдал (Performance efficiency)” presentation; "
        "“Software Time Behavior Research” судалгааны материал.",
        "foot",
    )
    footer.wrapOn(c, PAGE_W - 2 * MARGIN, 10 * mm)
    footer.drawOn(c, MARGIN, 8.2 * mm)
    c.showPage()
    c.save()
    print(OUT.resolve())
    print(f"final_y_left={left_y:.1f}, final_y_right={right_y:.1f}")


if __name__ == "__main__":
    main()
