const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const { GoogleSpreadsheet } = require("google-spreadsheet");

// configure Google sheet doc
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);

const addRowGoogleSheet = async (req, res) => {
    const data = req.body;

    // authenticate service account
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    // loads document properties and worksheets
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow(data, { raw: true, insert: true });
    res.status(StatusCodes.OK).json(data)
};

module.exports = addRowGoogleSheet;
