const QRCode = require("qrcode")

module.exports = (io) => {
  const socketQrCode = function (payload) {
    const socket = this
    QRCode.toDataURL(payload, {errorCorrectionLevel: "H"}, function (err, url) {
      io.emit("create:qrcode", url)
    })
  }

  return socketQrCode
}
