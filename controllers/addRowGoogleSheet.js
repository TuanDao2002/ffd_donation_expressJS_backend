const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const { GoogleSpreadsheet } = require("google-spreadsheet");

// configure Google sheet doc
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);

const nameRegex =
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ ,.'-]+$/i;
const phoneRegex = /^(03|05|07|08|09)+([0-9]{8})$/i;
const emailRegex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const provinces = [
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bạc Liêu",
    "Bắc Kạn",
    "Bắc Giang",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Dương",
    "Bình Định",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Cần Thơ",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Đồng Nai",
    "Đồng Tháp",
    "Điện Biên",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hòa Bình",
    "Hậu Giang",
    "Hưng Yên",
    "Thành phố Hồ Chí Minh",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lào Cai",
    "Lạng Sơn",
    "Lâm Đồng",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên - Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
];

const methods = ["Số Điện Thoại qua Zalo", "Email"];

const addRowGoogleSheet = async (req, res) => {
    let {
        name,
        phone,
        email,
        city,
        anon,
        amount,
        updateMethod,
        note,
        nickname,
    } = req.body;

    if (!name || !name.match(nameRegex)) {
        throw new CustomError.BadRequestError(
            "Tên phải hợp lệ và không được chứa số hay ký tự đặc biệt"
        );
    }

    if (!phone || !phone.match(phoneRegex)) {
        throw new CustomError.BadRequestError(
            "Số điện thoại của bạn không đúng định dạng"
        );
    }

    if (!email || !email.match(emailRegex)) {
        throw new CustomError.BadRequestError(
            "Địa chỉ email của bạn không đúng định dạng"
        );
    }

    if (!city || !provinces.includes(city)) {
        throw new CustomError.BadRequestError("Tỉnh thành không hợp lệ");
    }

    if (anon === "on") {
        anon = true;
    } else {
        anon = false;
    }

    if (!amount || Number(amount.replace(/[,a-z]/gi, "")) < 1000) {
        throw new CustomError.BadRequestError(
            "Số tiền tài trợ tối thiểu là 1,000 VND"
        );
    }

    if (!updateMethod || !methods.includes(updateMethod)) {
        throw new CustomError.BadRequestError(
            "Hình thức xác nhận không hợp lệ"
        );
    }

    if (!note) {
        note = "";
    }

    if (!nickname) {
        nickname = "";
    }

    let validatedDate = {
        name,
        phone,
        email,
        city,
        anon,
        amount,
        updateMethod,
        note,
        nickname,
    };

    // authenticate service account
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    // loads document properties and worksheets
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow(validatedDate, { raw: true, insert: true });
    res.status(StatusCodes.OK).json(validatedDate);
};

module.exports = addRowGoogleSheet;
