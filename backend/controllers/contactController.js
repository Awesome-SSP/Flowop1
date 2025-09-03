// controllers/contactController.js
const fs = require('fs');
const path = require('path');

exports.registerContact = async (req, res) => {
  try {
    const contactData = {
      type: req.body.type || "",
      existingContacts: req.body.existingContacts || "",
      firstName: req.body.firstName || "",
      lastName: req.body.lastName || "",
      suffix: req.body.suffix || "",
      title: req.body.title || "",
      status: req.body.status || "Active",
      goesBy: req.body.goesBy || "",
      pronouns: req.body.pronouns || "",
      emailAddress: req.body.emailAddress || "",
      officeNumber: req.body.officeNumber || "",
      cellNumber: req.body.cellNumber || "",
      addressLine1: req.body.addressLine1 || "",
      addressLine2: req.body.addressLine2 || "",
      city: req.body.city || "",
      state: req.body.state || "",
      zip: req.body.zip || "",
      dateOfBirth: req.body.dateOfBirth || "",
      workAnniversary: req.body.workAnniversary || "",
      maritalStatus: req.body.maritalStatus || "",
      spouseName: req.body.spouseName || "",
      childrensName: req.body.childrensName || "",
      college: req.body.college || "",
      degree: req.body.degree || "",
      priorEmployer: req.body.priorEmployer || "",
      endDate: req.body.endDate || "",
      notes: req.body.notes || "",
      sportsTeam: req.body.sportsTeam || "",
      favorites: req.body.favorites || "",
      group: req.body.group || "",
      report: req.body.report || "",
    };

    const dataDir = path.join(__dirname, '..', 'data');
    const filePath = path.join(dataDir, 'contacts.json');

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Read existing contacts
    let contacts = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      contacts = fileContent ? JSON.parse(fileContent) : [];
    }

    // Add new contact
    contacts.push(contactData);

    // Save updated contacts
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));

    res.status(200).json({ message: "Contact registered successfully", data: contactData });
  } catch (error) {
    res.status(500).json({ message: "Error registering contact", error: error.message });
  }
};
