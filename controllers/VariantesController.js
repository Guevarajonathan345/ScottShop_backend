export const createVariantes = async (req, res) => {
  const { product_id, almacenamiento, ram, precio, stock, sku } = req.body;

  try {

    // Validar SKU único
    const [existing] = await pool.query(
      "SELECT id FROM producto_variantes WHERE sku = ?",
      [sku]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "El SKU ya existe",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO product_variants 
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

    //Sku unico
    if (sku) {
        const [existing] = await pool.query(
            "SELECT id FROM producto_variantes WHERE sku = ? AND id != ?",
            [sku, id]
        );

        if (existing.length > 0){
            return res.status(400).json ({
                message: "El SKU ya esta en uso"
            });
        }
    }

    const [result] = await pool.query(
      `UPDATE product_variants 
       SET precio = ?, stock = ?, almacenamiento = ?, ram = ?, sku = ?
       WHERE id = ?`,
      [precio, stock, almacenamiento, ram, sku, id]
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