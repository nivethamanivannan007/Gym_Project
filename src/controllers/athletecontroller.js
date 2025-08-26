import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Calculate weightCategory based on age, weight, and gender
const calculateWeightCategory = ({ age, weight, gender }) => {
  const male = gender.toLowerCase() === 'male';
  const female = gender.toLowerCase() === 'female';

  if (age >= 14 && age <= 18 && ((male && weight <= 53) || (female && weight <= 43)))
    return 'Sun Junior';

  if (age >= 19 && age <= 23 && ((male && weight >= 54 && weight <= 59) || (female && weight >= 44 && weight <= 47)))
    return 'Junior';

  if (age >= 24 && age <= 39 && ((male && weight >= 60 && weight <= 66) || (female && weight >= 48 && weight <= 52)))
    return 'Senior';

  if (age >= 40 && age <= 49 && ((male && weight >= 67 && weight <= 74) || (female && weight >= 53 && weight <= 57)))
    return 'Master 1';

  if (age >= 50 && age <= 59 && ((male && weight >= 75 && weight <= 83) || (female && weight >= 58 && weight <= 63)))
    return 'Master 2';

  if (age >= 60 && age <= 69 && ((male && weight >= 84 && weight <= 93) || (female && weight >= 64 && weight <= 69)))
    return 'Master 3';

  if (age >= 70 && age <= 79 && ((male && weight >= 94 && weight <= 105) || (female && weight >= 70 && weight <= 76)))
    return 'Master 4';

  if (age >= 80 && age <= 99 && (
    (male && (weight >= 106 && weight <= 120 || weight > 120)) ||
    (female && (weight >= 77 && weight <= 84 || weight > 84))
  ))
    return 'Master 5';

  return null;
};

// CREATE
export const createAthlete = async (req, res) => {
  try {
    const {
      name, dob, age, gender, weight,
      aadharNumber, mobile, eventId, gymId
    } = req.body;

    const parsedAge = parseInt(age);
    const parsedWeight = parseFloat(weight);

    const weightCategory = calculateWeightCategory({ age: parsedAge, weight: parsedWeight, gender });

    if (!weightCategory) {
      return res.status(400).json({ error: "Athlete does not meet category eligibility requirements" });
    }

    const photoUrl = req.files?.['photo']?.[0]?.filename || null;
    const aadharUrl = req.files?.['aadhar']?.[0]?.filename || null;

    const athlete = await prisma.athlete.create({
      data: {
        name,
        dob: new Date(dob),
        age: parsedAge,
        gender,
        weight: parsedWeight,
        weightCategory,
        aadharNumber,
        mobile,
        photoUrl,
        aadharUrl,
        eventId: parseInt(eventId),
        gymId: parseInt(gymId)
      }
    });

    res.json(athlete);
  } catch (error) {
    console.error("Create Athlete Error:", error);
    res.status(500).json({ error: "Failed to create athlete" });
  }
};

// ✅ GET ALL - UPDATED TO INCLUDE EVENT AND GYM NAME
export const getAllAthletes = async (req, res) => {
  try {
    const athletes = await prisma.athlete.findMany({
      include: {
        event: true, // include event name
        gym: true    // include gym name
      }
    });
    res.json(athletes);
  } catch (error) {
    console.error("Get Athletes Error:", error);
    res.status(500).json({ error: "Failed to fetch athletes" });
  }
};

// GET BY ID
export const getAthleteById = async (req, res) => {
  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    res.json(athlete);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch athlete" });
  }
};

// UPDATE
export const updateAthlete = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      name, dob, age, gender, weight,
      aadharNumber, mobile, eventId, gymId
    } = req.body;

    const parsedAge = parseInt(age);
    const parsedWeight = parseFloat(weight);

    const weightCategory = calculateWeightCategory({ age: parsedAge, weight: parsedWeight, gender });

    if (!weightCategory) {
      return res.status(400).json({ error: "Athlete does not meet category eligibility requirements" });
    }

    const data = {
      name,
      dob: new Date(dob),
      age: parsedAge,
      gender,
      weight: parsedWeight,
      weightCategory,
      aadharNumber,
      mobile,
      eventId: parseInt(eventId),
      gymId: parseInt(gymId)
    };

    if (req.files?.['photo']) {
      data.photoUrl = req.files['photo'][0].filename;
    }
    if (req.files?.['aadhar']) {
      data.aadharUrl = req.files['aadhar'][0].filename;
    }

    const updated = await prisma.athlete.update({
      where: { id },
      data
    });

    res.json(updated);
  } catch (error) {
    console.error("Update Athlete Error:", error);
    res.status(500).json({ error: "Failed to update athlete" });
  }
};

// DELETE
export const deleteAthlete = async (req, res) => {
  try {
    await prisma.athlete.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete athlete" });
  }
};
