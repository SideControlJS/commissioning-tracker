const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const Project = require('../models/Project');
const Room = require('../models/Room');
const Equipment = require('../models/Equipment');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to handle file uploads
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const filePath = file.path;
    const fileExt = file.originalname.split('.').pop();

    let data;
    if (fileExt === 'csv') {
      data = await parseCSV(filePath);
    } else if (['xlsx', 'xls'].includes(fileExt)) {
      data = parseExcel(filePath);
    } else {
      return res.status(400).send('Unsupported file format');
    }

    // Process data to create Projects, Rooms, and Equipment
    const project = await Project.create({
      name: data.projectName,
      type: data.projectType,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    for (const roomData of data.rooms) {
      const room = await Room.create({
        roomNumber: roomData.roomNumber,
        project: project._id,
        status: roomData.status || 'untested',
      });

      for (const equipmentData of roomData.equipment) {
        await Equipment.create({
          serialNumber: equipmentData.serialNumber,
          type: equipmentData.type,
          room: room._id,
          status: equipmentData.status || 'in-use',
        });
      }
    }

    fs.unlinkSync(filePath); // Clean up uploaded file
    res.status(200).send('File processed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing file');
  }
});

// Helper functions to parse CSV and Excel
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = {
      projectName: '',
      projectType: '',
      startDate: '',
      endDate: '',
      rooms: [],
    };

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Customize based on your CSV structure
        // Example:
        if (data.type === 'project') {
          results.projectName = data.name;
          results.projectType = data.projectType;
          results.startDate = data.startDate;
          results.endDate = data.endDate;
        } else if (data.type === 'room') {
          results.rooms.push({
            roomNumber: data.roomNumber,
            status: data.status,
            equipment: [], // Populate later
          });
        } else if (data.type === 'equipment') {
          const room = results.rooms.find(r => r.roomNumber === data.roomNumber);
          if (room) {
            room.equipment.push({
              serialNumber: data.serialNumber,
              type: data.equipmentType,
              status: data.equipmentStatus,
            });
          }
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });
};

const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  const results = {
    projectName: '',
    projectType: '',
    startDate: '',
    endDate: '',
    rooms: [],
  };

  jsonData.forEach(row => {
    // Customize based on your Excel structure
    if (row.type === 'project') {
      results.projectName = row.name;
      results.projectType = row.projectType;
      results.startDate = row.startDate;
      results.endDate = row.endDate;
    } else if (row.type === 'room') {
      results.rooms.push({
        roomNumber: row.roomNumber,
        status: row.status || 'untested',
        equipment: [],
      });
    } else if (row.type === 'equipment') {
      const room = results.rooms.find(r => r.roomNumber === row.roomNumber);
      if (room) {
        room.equipment.push({
          serialNumber: row.serialNumber,
          type: row.equipmentType,
          status: row.equipmentStatus || 'in-use',
        });
      }
    }
  });

  return results;
};

module.exports = router;
