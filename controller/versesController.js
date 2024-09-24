import { tryCatch } from "../utils/catchAsync.js";
import db from "../db/index.js";
export const addSavedVerses = tryCatch(async (req, res) => {
  const userId = req.params.id;
  const { surah, verse } = req.body;
  //HANDLING SURAH
  const surahResult = await db.query(
    `
    INSERT INTO surah(id,name,englishname,translationname,numberofayahs)
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (id) DO NOTHING
    RETURNING id`,
    [
      surah.id,
      surah.name,
      surah.englishName,
      surah.translationName,
      surah.numberOfAyahs,
    ]
  );
  let surahId;
  if (surahResult.rows.length > 0) {
    surahId = surahResult.rows[0].id;
  } else {
    const existingSurah = await db.query("SELECT id FROM surah WHERE id = $1", [
      surah.id,
    ]);
    surahId = existingSurah.rows[0].id;
  }

  //HANDLING VERSES
  const verseResult = await db.query(
    `
    INSERT INTO verses(numberinsurah,text,sajda,surahid,number)
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (id) DO NOTHING
    RETURNING id`,
    [verse.numberInSurah, verse.text, verse.sajda, surahId, verse.number]
  );
  let verseId;
  if (verseResult.rows.length > 0) {
    verseId = verseResult.rows[0].id;
  } else {
    const existingVerse = await db.query(
      "SELECT id FROM verses WHERE id = $1",
      [verse.id]
    );
    verseId = existingVerse.rows[0].id;
  }
  await db.query("INSERT INTO savedverses (userId,verseId) VALUES ($1,$2)", [
    userId,
    verseId,
  ]);
  res.status(200).json({ status: "succuss", msh: "verse was saved" });
});
