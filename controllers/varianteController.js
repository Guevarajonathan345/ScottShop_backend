export const createVariantes = async (req, res) => {
  const { product_id, almacenamiento, ram, precio, stock, sku } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT id FROM productos_variantes WHERE sku = ?",
      [sku]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "El SKU ya existe",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO productos_variantes 
       (product_id, almacenamiento, ram, precio, stock, sku)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [product_id, almacenamiento, ram, precio, stock, sku]
    );

    res.status(201).json({
      message: "Variante creada",
      id: result.insertId,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al crear variante",
      error: error.message,
    });
  }
};


export const updateVariantes = async (req, res) => {
  const { id } = req.params;
  const { precio, stock, almacenamiento, ram, sku } = req.body;

  try {

    if (sku) {
      const [existing] = await pool.query(
        "SELECT id FROM productos_variantes WHERE sku = ? AND id != ?",
        [sku, id]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          message: "El SKU ya está en uso",
        });
      }
    }

    // construir dinámicamente
    let fields = [];
    let values = [];

    if (precio !== undefined) {
      fields.push("precio = ?");
      values.push(precio);
    }

    if (stock !== undefined) {
      fields.push("stock = ?");
      values.push(stock);
    }

    if (almacenamiento !== undefined) {
      fields.push("almacenamiento = ?");
      values.push(almacenamiento);
    }

    if (ram !== undefined) {
      fields.push("ram = ?");
      values.push(ram);
    }

    if (sku !== undefined) {
      fields.push("sku = ?");
      values.push(sku);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        message: "No hay campos para actualizar",
      });
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE productos_variantes SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Variante no encontrada",
      });
    }

    res.json({
      message: "Variante actualizada correctamente",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar variante",
      error: error.message,
    });
  }
};

export const deleteVariantes = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM productos_variantes WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Variante no encontrada",
      });
    }

    res.json({
      message: "Variante eliminada correctamente",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la variante",
      error: error.message,
    });
  }
};