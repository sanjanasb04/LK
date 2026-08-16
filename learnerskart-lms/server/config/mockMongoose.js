const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Directory for local JSON data persistence
const DB_DIR = path.join(__dirname, '..', 'data', 'json_db');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// In-memory collection store
const store = {};

// Helper to load collection data from file
function loadCollection(name) {
  if (store[name]) return store[name];
  const filePath = path.join(DB_DIR, `${name}.json`);
  if (fs.existsSync(filePath)) {
    try {
      store[name] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      store[name] = [];
    }
  } else {
    store[name] = [];
  }
  return store[name];
}

// Helper to save collection data to file
function saveCollection(name) {
  const filePath = path.join(DB_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(store[name] || [], null, 2), 'utf8');
}

// Helper to generate Unique string ID
function generateId() {
  return 'mock_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Simple filter matcher for mock queries
function matchQuery(item, query) {
  if (!query) return true;
  for (let key in query) {
    const val = query[key];
    if (val && typeof val === 'object') {
      if (val instanceof mongoose.Types.ObjectId || val._bsontype === 'ObjectID') {
        if (String(item[key]) !== String(val)) return false;
      } else if ('$in' in val) {
        const itemVal = item[key];
        const arrayVal = val['$in'];
        if (Array.isArray(itemVal)) {
          if (!itemVal.some(v => arrayVal.includes(String(v)))) return false;
        } else {
          if (!arrayVal.map(String).includes(String(itemVal))) return false;
        }
      }
    } else {
      if (String(item[key]) !== String(val)) return false;
    }
  }
  return true;
}

// Mock Query Chain
class MockQuery {
  constructor(results, modelClass, singleResult = false) {
    this.results = results;
    this.modelClass = modelClass;
    this.singleResult = singleResult;
  }

  populate(fields) {
    if (Array.isArray(this.results)) {
      this.results.forEach(item => populateItem(item, fields));
    } else if (this.results) {
      populateItem(this.results, fields);
    }
    return this;
  }

  sort(sortOptions) {
    return this;
  }

  select(selectOptions) {
    return this;
  }

  limit(limitVal) {
    if (Array.isArray(this.results)) {
      this.results = this.results.slice(0, limitVal);
    }
    return this;
  }

  skip(skipVal) {
    if (Array.isArray(this.results)) {
      this.results = this.results.slice(skipVal);
    }
    return this;
  }

  exec() {
    let finalVal = this.singleResult 
      ? (Array.isArray(this.results) ? (this.results[0] || null) : this.results)
      : this.results;

    if (this.modelClass && finalVal) {
      if (Array.isArray(finalVal)) {
        finalVal = finalVal.map(item => new this.modelClass(item));
      } else {
        finalVal = new this.modelClass(finalVal);
      }
    }
    return Promise.resolve(finalVal);
  }

  then(onResolve, onReject) {
    return this.exec().then(onResolve, onReject);
  }

  catch(onReject) {
    return this.exec().catch(onReject);
  }
}

// Helper to resolve reference populations
function populateItem(item, fields) {
  if (!item) return;
  const fieldList = typeof fields === 'string' ? fields.split(' ') : [];
  fieldList.forEach(field => {
    let modelName = field.charAt(0).toUpperCase() + field.slice(1);
    if (modelName === 'Author') modelName = 'User';
    if (modelName === 'Instructor') modelName = 'User';
    if (modelName === 'Attendees') modelName = 'User';

    const refId = item[field];
    if (refId) {
      if (Array.isArray(refId)) {
        const refColl = loadCollection(modelName);
        item[field] = refId.map(id => refColl.find(u => String(u._id) === String(id))).filter(Boolean);
      } else {
        const refColl = loadCollection(modelName);
        const resolved = refColl.find(u => String(u._id) === String(refId));
        if (resolved) item[field] = resolved;
      }
    }
  });
}

// Mock Model builder function
function createMockModel(modelName, schema) {
  const collectionName = modelName;

  class MockModel {
    constructor(data = {}) {
      Object.assign(this, data);
      if (!this._id) this._id = generateId();
    }

    async save() {
      const coll = loadCollection(collectionName);
      const existingIdx = coll.findIndex(item => String(item._id) === String(this._id));
      
      const docData = { ...this };
      // Remove class methods
      delete docData.save;
      
      if (existingIdx >= 0) {
        coll[existingIdx] = docData;
      } else {
        coll.push(docData);
      }
      saveCollection(collectionName);
      return this;
    }

    static async create(data) {
      const coll = loadCollection(collectionName);
      const items = Array.isArray(data) ? data : [data];
      const createdItems = items.map(itemData => {
        const doc = new MockModel(itemData);
        coll.push({ ...doc });
        return doc;
      });
      saveCollection(collectionName);
      return Array.isArray(data) ? createdItems : createdItems[0];
    }

    static find(query = {}) {
      const coll = loadCollection(collectionName);
      const filtered = coll.filter(item => matchQuery(item, query));
      return new MockQuery(JSON.parse(JSON.stringify(filtered)), MockModel);
    }

    static findOne(query = {}) {
      const coll = loadCollection(collectionName);
      const filtered = coll.filter(item => matchQuery(item, query));
      return new MockQuery(JSON.parse(JSON.stringify(filtered)), MockModel, true);
    }

    static findById(id) {
      const coll = loadCollection(collectionName);
      const item = coll.find(u => String(u._id) === String(id));
      return new MockQuery(item ? [JSON.parse(JSON.stringify(item))] : [], MockModel, true);
    }

    static async findByIdAndUpdate(id, update, options = {}) {
      const coll = loadCollection(collectionName);
      const idx = coll.findIndex(u => String(u._id) === String(id));
      if (idx >= 0) {
        const updated = { ...coll[idx], ...update };
        coll[idx] = updated;
        saveCollection(collectionName);
        return new MockModel(updated);
      }
      return null;
    }

    static async findOneAndUpdate(query, update, options = {}) {
      const coll = loadCollection(collectionName);
      const idx = coll.findIndex(item => matchQuery(item, query));
      if (idx >= 0) {
        const updated = { ...coll[idx], ...update };
        coll[idx] = updated;
        saveCollection(collectionName);
        return new MockModel(updated);
      }
      return null;
    }

    static async deleteMany(query = {}) {
      let coll = loadCollection(collectionName);
      const prevLength = coll.length;
      coll = coll.filter(item => !matchQuery(item, query));
      store[collectionName] = coll;
      saveCollection(collectionName);
      return { deletedCount: prevLength - coll.length };
    }

    static async deleteOne(query = {}) {
      const coll = loadCollection(collectionName);
      const idx = coll.findIndex(item => matchQuery(item, query));
      if (idx >= 0) {
        coll.splice(idx, 1);
        saveCollection(collectionName);
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    }

    static async countDocuments(query = {}) {
      const coll = loadCollection(collectionName);
      return coll.filter(item => matchQuery(item, query)).length;
    }
  }

  return MockModel;
}

// Monkey-patch mongoose functions
if (process.env.USE_MOCK_DB === 'true') {
  mongoose.model = function(name, schema) {
    return createMockModel(name, schema);
  };
  
  mongoose.connect = function() {
    return Promise.resolve({
      connection: { host: 'JSON_MOCK_DB' }
    });
  };

  // Mock ObjectId helper
  mongoose.Types.ObjectId = function(id) {
    if (id) return String(id);
    return 'mock_' + Math.random().toString(36).substr(2, 9);
  };
}
