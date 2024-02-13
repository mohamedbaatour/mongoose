const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: { type: [String] },
});

const Person = mongoose.model("Person", personSchema);

async function createAndSavePerson() {
  const person = new Person({
    name: "John Doe",
    age: 30,
    favoriteFoods: ["Pizza", "Burger", "Ice Cream"],
  });

  try {
    const savedPerson = await person.save();
    console.log("Person saved:", savedPerson);
  } catch (err) {
    console.error("Error saving person:", err);
  }
}

async function createManyPeople() {
  const arrayOfPeople = [
    { name: "Alice", age: 25, favoriteFoods: ["Sushi", "Pasta"] },
    { name: "Bob", age: 40, favoriteFoods: ["Steak", "Chocolate"] },
    { name: "Charlie", age: 35, favoriteFoods: ["Tacos", "Cheese"] },
  ];

  try {
    const createdPeople = await Person.create(arrayOfPeople);
    console.log("People created:", createdPeople);
  } catch (err) {
    console.error("Error creating people:", err);
  }
}

async function findPeopleByName(name) {
  try {
    const people = await Person.find({ name: name });
    console.log("People found by name:", people);
  } catch (err) {
    console.error("Error finding people by name:", err);
  }
}

async function findOnePersonByFood(food) {
  try {
    const person = await Person.findOne({ favoriteFoods: food });
    console.log("Person found by food:", person);
  } catch (err) {
    console.error("Error finding person by food:", err);
  }
}

async function findPersonById(personId) {
  try {
    const person = await Person.findById(personId);
    console.log("Person found by ID:", person);
  } catch (err) {
    console.error("Error finding person by ID:", err);
  }
}

async function findEditThenSave(personId) {
  try {
    const person = await Person.findById(personId);

    if (!person) {
      console.log("Person not found for editing.");
      return;
    }

    person.favoriteFoods.push("Hamburger");
    const updatedPerson = await person.save();
    console.log("Person updated:", updatedPerson);
  } catch (err) {
    console.error("Error updating person:", err);
  }
}

async function findAndUpdate(personName) {
  try {
    const updatedPerson = await Person.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true }
    );
    console.log("Person updated:", updatedPerson);
  } catch (err) {
    console.error("Error updating person:", err);
  }
}

async function removeById(personId) {
  try {
    const removedPerson = await Person.findByIdAndDelete(personId);
    if (removedPerson) {
      console.log("Person removed:", removedPerson);
    } else {
      console.log("Person not found for removal.");
    }
  } catch (err) {
    console.error("Error removing person:", err);
  }
}

async function removeMary() {
  try {
    const result = await Person.deleteMany({ name: "Mary" });
    console.log("People named Mary deleted:", result.deletedCount);
  } catch (err) {
    console.error("Error deleting people named Mary:", err);
  }
}

async function chainSearchQuery() {
  try {
    const burritoLovers = await Person.find({ favoriteFoods: "Burritos" })
      .sort("name")
      .limit(2)
      .select("-age")
      .exec();
    console.log("Burrito lovers:", burritoLovers);
  } catch (err) {
    console.error("Error finding burrito lovers:", err);
  }
}

(async () => {
  try {
    await createAndSavePerson();
    await createManyPeople();
    await findPeopleByName("John");
    await findOnePersonByFood("Pizza");
    await findPersonById("607c5200c293a05a682c49f7");
    await findEditThenSave("607c5200c293a05a682c49f7");
    await findAndUpdate("John");
    await removeById("607c5200c293a05a682c49f7");
    await removeMary();
    await chainSearchQuery();
  } catch (error) {
    console.error("Error in main script:", error);
  } finally {
    mongoose.disconnect();
  }
})();
