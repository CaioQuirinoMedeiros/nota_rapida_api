const School = require("../app/models/School");
const Branch = require("../app/models/Branch");

module.exports = async () => {
  const Unico = await School.findOne({ name: "Único" });
  const EscritaUnica = await School.findOne({ name: "Escrita Única" });
  const Seb = await School.findOne({ name: "SEB" });

  const branches = [
    {
      name: "Asa Sul",
      school: Unico._id
    },
    {
      name: "Taguatinga",
      school: Unico._id
    },
    {
      name: "Asa Sul",
      school: EscritaUnica._id
    },
    {
      name: "Taguatinga",
      school: EscritaUnica._id
    },
    {
      name: "Asa Sul",
      school: Seb._id
    }
  ];

  await Promise.all(
    branches.map(async branch => {
      const branchInstance = new Branch(branch);
      await branchInstance.save();
    })
  );

  return console.log("Branches created successfully!");
};
