const School = require("../app/models/School");

module.exports = async () => {
  const schools = [
    {
      name: "Único"
    },
    {
      name: "Escrita Única"
    },
    {
      name: "SEB"
    }
  ];

  await Promise.all(
    schools.map(async school => {
      const schoolModel = new School(school);
      await schoolModel.save();
    })
  );

  console.log("Schools created successfully!");
};
