const express = require("express");
const Country = require("../../models/SettingModels/CoutryModels");

const router = express.Router();

/**
 * @route GET /countries
 * @desc Get all countries
 */
router.get("/countries", async (req, res) => {
  try {
    const countries = await Country.find({}, "name iso2 iso3 phonecode capital currency");
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route GET /countries/:iso2
 * @desc Get a country by ISO2 code
 */
router.get("/countries/:iso2", async (req, res) => {
  try {
    const { iso2 } = req.params;
    const country = await Country.findOne({ iso2: iso2.toUpperCase() });

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.json(country);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route GET /countries/:iso2/states
 * @desc Get states by country ISO2 code
 */
router.get("/countries/:iso2/states", async (req, res) => {
    try {
      const { iso2 } = req.params;
      const country = await Country.findOne({ iso2: iso2.toUpperCase() }, "states");
  
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
  
      // Ensure the correct `id` field is returned, not MongoDB `_id`
      res.json(country.states.map(state => ({ id: state.id, name: state.name }))); 
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  

/**
 * @route GET /countries/:iso2/states/:stateId/cities
 * @desc Get cities by state numeric ID within a country
 */
router.get("/countries/:iso2/states/:stateCode/cities", async (req, res) => {
    try {
        const { iso2, stateCode } = req.params;

        // 🔹 Fetch country with states field only
        const country = await Country.findOne({ iso2: iso2.toUpperCase() }, "states");

        if (!country) {
            return res.status(404).json({ message: "Country not found" });
        }

        // 🔹 Check if states exist
        if (!country.states || country.states.length === 0) {
            return res.status(404).json({ message: "No states found for this country" });
        }
        // state_code: 'AN',
        console.log("States Found:", country.states[0].name===stateCode); 
        // 🔹 Find the state by `state_code`
        const state = country.states.find(
            (s) => s.name == stateCode
        );

        console.log("Matched State Cities:", state?.cities);


        if (!state) {
            return res.status(404).json({ message: "State not found" });
        }

        res.json(state || []); // Return empty array if no cities found

    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;

  

module.exports = router;
