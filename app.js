const express = require("express")
const request = require("request")
const fs = require('fs');
const path = require('path');
const app = express()

const lesionList = [
    { name: "Melanoma", image: "https://www.mayoclinic.org/-/media/kcms/gbs/patient-consumer/images/2013/11/15/17/38/ds00190_-ds00439_im01723_r7_skincthu_jpg.jpg", description: "Melanoma, the most serious type of skin cancer, develops in the cells (melanocytes) that produce melanin — the pigment that gives your skin its color. Melanoma can also form in your eyes and, rarely, inside your body, such as in your nose or throat." },
    { name: "Melanocytic Nevus", image: "https://www.mayoclinic.org/-/media/kcms/gbs/patient-consumer/images/2013/11/15/17/38/ds00121_-ds00439_im01637_r7_molethu_jpg.jpg", description: "Melanocytic nevus is the medical term for a mole. Nevi can appear anywhere on the body. They are benign (non-cancerous) and typically do not require treatment. A very small percentage of melanocytic nevi may develop a melanoma within them. Of note, the majority of cutaneous melanomas arise within normally appearing skin." },
    { name: "Skin lesion", image: "https://www.health.com/thmb/AT4NxaeFgEgt4MGoWbRWaHY6wvs=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/VesiclesGettyImages-1176815581-8d5b59c3e24543cdb32bdd1d7b054482.jpg", description: "Skin lesions are any area of your skin that’s abnormal from the skin around it. Skin lesions are common and are often the result of an injury or damage to your skin, but some have the potential to be cancerous." },
    { name: "Basal Cell Carcinoma", image: "https://cdcssl.ibsrv.net/cimg/www.officiteaadeducationlibrary.smb/580x290_60/6/shutterstock-1639873987-672922-690006.jpg", description: "Basal cell carcinoma (BCC) is the most common form of skin cancer and the most frequently occurring form of all cancers. In the U.S. alone, an estimated 3.6 million cases are diagnosed each year. BCCs arise from abnormal, uncontrolled growth of basal cells." },
    { name: "Dermatofibroma", image: "https://uploads-ssl.webflow.com/5ff522e90d3635b8dc61c25e/5ff522e90d36350a5061c302_shutterstock_1347781919.jpg", description: "A dermatofibroma is a common benign fibrous nodule usually found on the skin of the lower legs. A dermatofibroma is also called a cutaneous fibrous histiocytoma." },
    { name: "Seborrheic Keratoses", image: "https://assets.mayoclinic.org/content/dam/media/global/images/2023/02/08/close-up-of-seborrheic-keratoses.jpg", description: "A seborrheic keratosis (seb-o-REE-ik ker-uh-TOE-sis) is a common noncancerous (benign) skin growth. People tend to get more of them as they get older." },
    { name: "Port Wine Stain", image: "https://cdn.mdedge.com/files/s3fs-public/Image/April-2018/portwinestain_web.jpg", description: "A port wine stain is a permanent birthmark. It’s a smooth, flat, pink, red or purple patch on a newborn that may get darker and raised or bumpy over time." },
    { name: "Hemangioma", image: "https://www.mayoclinic.org/-/media/kcms/gbs/patient-consumer/images/2013/08/26/10/02/ds00848_im00306_ans7_strawberry_hemangioma_jpg.jpg", description: "A hemangioma (he-man-jee-O-muh), also known as an infantile hemangioma or hemangioma of infancy, is a bright red birthmark. It looks like a rubbery bump or flat red patch and is made up of extra blood vessels in the skin. The mark shows up at birth or in the first month of life." },
    { name: "Venous lake", image: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Venous_lake_1.jpg", description: "A venous lake is a common bluish soft macule or papule due to vascular dilatation. It is most often seen on the lower lip." },
    { name: "Solar lentigo", image: "https://www.medwebplus.com/wp-content/uploads/2020/02/Solar-Lentigo.jpg", description: "Solar lentigo is a harmless patch of darkened skin. It results from exposure to ultraviolet (UV) radiation, which causes local proliferation of melanocytes and accumulation of melanin within the skin cells (keratinocytes). Solar lentigos or lentigines are very common, especially in people over the age of 40 years. Sometimes they are also known as an “old age spot” or “senile freckle”." },
    
]

app.use(express.static('public'))
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'))

app.get("/", function (req, res) {
    res.render("index.ejs", { lesionList: lesionList })
})

app.get("/info/", function (req, res) {
    res.render("info.ejs", { lesionList: lesionList })
})

app.get('/info/:lesionName', function (req, res) {
    const lesionName = req.params.lesionName;
    const filename = path.join(app.get('views'), `${lesionName}.ejs`);

    fs.access(filename, fs.constants.F_OK, (err) => {
        if (err) {
            // If the file doesn't exist, render an error page
            res.render('404.ejs', { errorMessage: `Lesion '${lesionName}' not found.` });
        } else {
            // If the file exists, render it
            res.render(lesionName, { lesionList: lesionList });
        }
    });
});

app.get("*", function (req, res) {
    res.render("404.ejs")
})

app.listen(3000, () => console.log("Server started (port 3000)"))
