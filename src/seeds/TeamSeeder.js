const School = require("../app/models/School");
const Branch = require("../app/models/Branch");
const Team = require("../app/models/Team");

module.exports = async () => {
  const Unico = await School.findOne({ name: "Único" });
  const EscritaUnica = await School.findOne({ name: "Escrita Única" });
  const Seb = await School.findOne({ name: "SEB" });

  const UnicoAsaSul = await Branch.findOne({
    school: Unico._id,
    name: "Asa Sul"
  });
  const UnicoTaguatinga = await Branch.findOne({
    school: Unico._id,
    name: "Taguatinga"
  });
  const EscritaUnicaAsaSul = await Branch.findOne({
    school: EscritaUnica._id,
    name: "Asa Sul"
  });
  const EscritaUnicaTaguatinga = await Branch.findOne({
    school: EscritaUnica._id,
    name: "Taguatinga"
  });
  const SebAsaSul = await Branch.findOne({
    school: Seb._id,
    name: "Asa Sul"
  });

  const teams = [
    {
      name: "1ª APLICAÇÃO",
      branch: UnicoAsaSul._id
    },
    {
      name: "1ª BRIO",
      branch: UnicoAsaSul._id
    },
    {
      name: "1ª CERTEZA",
      branch: UnicoAsaSul._id
    },
    {
      name: "1ª DEDICAÇÃO",
      branch: UnicoAsaSul._id
    },
    {
      name: "2ª ÊXITO",
      branch: UnicoAsaSul._id
    },
    {
      name: "2ª FORÇA",
      branch: UnicoAsaSul._id
    },
    {
      name: "2ª GARRA",
      branch: UnicoAsaSul._id
    },
    {
      name: "3ª HONRA",
      branch: UnicoAsaSul._id
    },
    {
      name: "3ª INSPIRAÇÃO",
      branch: UnicoAsaSul._id
    },
    {
      name: "3ª JUSTIÇA",
      branch: UnicoAsaSul._id
    },
    {
      name: "1ª NOTÁVEL",
      branch: UnicoTaguatinga._id
    },
    {
      name: "1ª RESPEITO",
      branch: UnicoTaguatinga._id
    },
    {
      name: "2ª MOTIVAÇÃO",
      branch: UnicoTaguatinga._id
    },
    {
      name: "2ª OTIMISMO",
      branch: UnicoTaguatinga._id
    },
    {
      name: "3ª QUINTESSÊNCIA",
      branch: UnicoTaguatinga._id
    },
    {
      name: "3ª PERSPICÁCIA",
      branch: UnicoTaguatinga._id
    },
    {
      name: "Pré-ENEM",
      branch: EscritaUnicaAsaSul._id
    },
    {
      name: "Pré-Vestibular",
      branch: EscritaUnicaAsaSul._id
    },
    {
      name: "Pré-ENEM",
      branch: EscritaUnicaTaguatinga._id
    },
    {
      name: "Pré-Vestibular",
      branch: EscritaUnicaTaguatinga._id
    },
    {
      name: "1M1",
      branch: SebAsaSul._id
    },
    {
      name: "1M2",
      branch: SebAsaSul._id
    },
    {
      name: "1M3",
      branch: SebAsaSul._id
    },
    {
      name: "1M4",
      branch: SebAsaSul._id
    },
    {
      name: "1M5",
      branch: SebAsaSul._id
    },
    {
      name: "2M1",
      branch: SebAsaSul._id
    },
    {
      name: "2M2",
      branch: SebAsaSul._id
    },
    {
      name: "2M3",
      branch: SebAsaSul._id
    },
    {
      name: "2M4",
      branch: SebAsaSul._id
    },
    {
      name: "2M5",
      branch: SebAsaSul._id
    },
    {
      name: "3M1",
      branch: SebAsaSul._id
    },
    {
      name: "3M2",
      branch: SebAsaSul._id
    },
    {
      name: "3M3",
      branch: SebAsaSul._id
    },
    {
      name: "3M4",
      branch: SebAsaSul._id
    },
    {
      name: "3M5",
      branch: SebAsaSul._id
    }
  ];

  await Promise.all(
    teams.map(async team => {
      const teamInstance = new Team(team);
      await teamInstance.save();
    })
  );

  return console.log("Teams created successfully!");
};
