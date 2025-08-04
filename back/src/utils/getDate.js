const getDate = () => {
  const date = new Date();
  return date.toLocaleString("es-MX", { timeZone: "America/Santiago" });
};

module.exports = { getDate };
