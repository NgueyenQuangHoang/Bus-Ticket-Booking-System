import * as busLayoutModel from '../models/busLayoutModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      bus_company_id: req.query.bus_company_id || undefined,
      is_template: req.query.is_template !== undefined ? req.query.is_template : undefined,
      search: req.query.search || undefined,
    };

    const result = await busLayoutModel.findAll(filters);

    res.json({
      success: true,
      data: result.data,
      total: result.total,
      page: filters.page,
      limit: filters.limit,
    });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const layout = await busLayoutModel.findById(req.params.id);
    if (!layout) {
      return res.status(404).json({ success: false, message: 'Bus layout not found' });
    }

    res.json({ success: true, data: layout, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = { ...req.body };

    // BUS_COMPANY must always use their own company ID, never global or another company's
    if (req.user?.role === 'BUS_COMPANY') {
      if (!req.user.bus_company_id) {
        return res.status(403).json({ success: false, message: 'No bus_company_id associated with your account' });
      }
      data.bus_company_id = req.user.bus_company_id;
    }

    const layout = await busLayoutModel.create(data);

    res.status(201).json({ success: true, data: layout, message: 'Bus layout created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await busLayoutModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Bus layout not found' });
    }

    const data = { ...req.body };

    if (req.user?.role === 'BUS_COMPANY') {
      const isOwn = existing.bus_company_id !== null && existing.bus_company_id !== undefined &&
        String(existing.bus_company_id) === String(req.user.bus_company_id);
      const isGlobal = existing.bus_company_id === null || existing.bus_company_id === undefined;

      if (!isOwn && !isGlobal) {
        return res.status(403).json({ success: false, message: 'You can only update your own layouts' });
      }

      if (isGlobal) {
        // BUS_COMPANY claiming a global template — assign their company
        data.bus_company_id = req.user.bus_company_id;
      } else {
        // Already their own template — prevent ownership transfer
        delete data.bus_company_id;
      }
    }
    // ADMIN: no bus_company_id restriction

    const layout = await busLayoutModel.update(req.params.id, data);

    res.json({ success: true, data: layout, message: 'Bus layout updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const clone = async (req, res, next) => {
  try {
    const source = await busLayoutModel.findById(req.params.id);
    if (!source) {
      return res.status(404).json({ success: false, message: 'Bus layout not found' });
    }

    // Determine target company: BUS_COMPANY is always forced to their own company
    let targetCompanyId = req.body.bus_company_id;
    if (req.user?.role === 'BUS_COMPANY') {
      if (!req.user.bus_company_id) {
        return res.status(403).json({ success: false, message: 'No bus_company_id associated with your account' });
      }
      targetCompanyId = req.user.bus_company_id;
    }

    if (!targetCompanyId) {
      return res.status(400).json({ success: false, message: 'bus_company_id is required' });
    }

    const cloned = await busLayoutModel.cloneForCompany(req.params.id, targetCompanyId, req.body.layout_name, req.body.is_template !== undefined ? req.body.is_template : 1);
    res.status(201).json({ success: true, data: cloned, message: 'Layout cloned successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await busLayoutModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Bus layout not found' });
    }

    // BUS_COMPANY can only delete layouts that belong to their own company
    if (req.user?.role === 'BUS_COMPANY') {
      if (String(existing.bus_company_id) !== String(req.user.bus_company_id)) {
        return res.status(403).json({ success: false, message: 'You can only delete your own layouts' });
      }
    }

    await busLayoutModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Bus layout deleted successfully' });
  } catch (err) {
    next(err);
  }
};
