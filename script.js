function ToSeoUrl(textString) {
    textString = textString.trim();
    textString = textString.replace(/ /g, "-");
    textString = textString.replace(/</g, "");
    textString = textString.replace(/>/g, "");
    textString = textString.replace(/"/g, "");
    textString = textString.replace(/é/g, "");
    textString = textString.replace(/!/g, "");
    textString = textString.replace(/’/, "");
    textString = textString.replace(/£/, "");
    textString = textString.replace(/^/, "");
    textString = textString.replace(/#/, "");
    textString = textString.replace(/$/, "");
    textString = textString.replace(/\+/g, "");
    textString = textString.replace(/%/g, "");
    textString = textString.replace(/½/g, "");
    textString = textString.replace(/&/g, "");
    textString = textString.replace(/\//g, "");
    textString = textString.replace(/{/g, "");
    textString = textString.replace(/\(/g, "");
    textString = textString.replace(/\[/g, "");
    textString = textString.replace(/\)/g, "");
    textString = textString.replace(/]/g, "");
    textString = textString.replace(/=/g, "");
    textString = textString.replace(/}/g, "");
    textString = textString.replace(/\?/g, "");
    textString = textString.replace(/\*/g, "");
    textString = textString.replace(/@/g, "");
    textString = textString.replace(/€/g, "");
    textString = textString.replace(/~/g, "");
    textString = textString.replace(/æ/g, "");
    textString = textString.replace(/ß/g, "");
    textString = textString.replace(/;/g, "");
    textString = textString.replace(/,/g, "");
    textString = textString.replace(/`/g, "");
    textString = textString.replace(/|/g, "");
    textString = textString.replace(/\./g, "");
    textString = textString.replace(/:/g, "");
    textString = textString.replace(/İ/g, "i");
    textString = textString.replace(/I/g, "i");
    textString = textString.replace(/ı/g, "i");
    textString = textString.replace(/ğ/g, "g");
    textString = textString.replace(/Ğ/g, "g");
    textString = textString.replace(/ü/g, "u");
    textString = textString.replace(/Ü/g, "u");
    textString = textString.replace(/ş/g, "s");
    textString = textString.replace(/Ş/g, "s");
    textString = textString.replace(/ö/g, "o");
    textString = textString.replace(/Ö/g, "o");
    textString = textString.replace(/ç/g, "c");
    textString = textString.replace(/Ç/g, "c");
    textString = textString.replace(/–/g, "-");
    textString = textString.replace(/—/g, "-");
    textString = textString.replace(/—-/g, "-");
    textString = textString.replace(/—-/g, "-");

    return textString.toLowerCase();
}

function httpGet(theUrl) {
    return new Promise(resolve => {
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                resolve(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", theUrl, false);
        xmlhttp.send();
    });
}

let obj = {};

function hazirla() {
    let val = ToSeoUrl(document.getElementById('url_input').value);
    val = "https://www.hekimler.net/hastaneler/aile-sagligi-merkezi/" + val;

    setTimeout(function () {
        httpGet(val).then((response) => {
            try {
                $("#index").html(response);
                let container = $("#index h4.pt-3").parent();
                let il = $("#index h1").text().split(" ")[0];
                obj[il] = {}
                let title = "";
                container.find("*").each(function () {
                    if ($(this)[0].tagName === "H4") {
                        title = $(this).text();
                        obj[il][title] = [];
                    }
                    if ($(this)[0].tagName === "A") {
                        let href = $(this).attr("href");

                        let ocakObj = {
                            il: il,
                            ilce: title,
                            merkez: $(this).text()
                        };

                        httpGet(href).then((response) => {
                            $("#sub").html(response);
                            let iletisim = $("#sub ").find("[itemprop=address] p").text()
                            iletisim = iletisim.split("Adres: ")[1].split("Telefon: ");
                            ocakObj["adres"] = iletisim[0];
                            ocakObj["tel"] = iletisim[1];
                            ocakObj["hekimler"] = []
                            $("#sub h4:contains('Aile Hekimi')").parent().find("a").each(function () {
                                ocakObj["hekimler"].push($(this).text())
                            })
                        })
                        obj[il][title].push(ocakObj);
                    }
                })

                console.log(obj, il);

                let items = [];

                for (let k in obj[il]) {
                    for (let ke in obj[il][k]) {
                        let item = obj[il][k][ke];
                        items.push(item);
                    }
                }


                let html = "";
                for (let kegr in items) {

                    setTimeout(function () {
                        let item = items[kegr];

                        for (let keyh in item.hekimler) {
                            html += `<tr>
                                        <td>${item.merkez}</td>
                                        <td>${item.adres.replace(" " + item.ilce + " / " + item.il, "")}</td>
                                        <td>${item.ilce}</td>
                                        <td>${item.il}</td>
                                        <td>${item.hekimler[keyh]}</td>
                                        <td>${item.tel}</td>
                                    </tr>`
                        }

                    }, 500)

                }

                setTimeout(function () {
                    $("#form_div").remove();
                    $("#index").remove();
                    $("#sub").remove();
                    $("#export").html(`<table border="1" cellspacing="0" cellpadding="0">` + html + `</table>`);
                }, 1000)
            } catch (err) {
                console.log(err);
                $("#form_div").html("hata oluştu!");
            }
        }).catch((err) => {
            console.log(err);
            $("#form_div").html("hata oluştu!");
        })
    }, 1);

    document.getElementById('form_div').innerHTML = "işleniyor...";
}
