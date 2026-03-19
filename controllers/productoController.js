import pool from "../db.js";


// GET PRODUCTOS (CON VARIANTES)
export const getProductos = async (req, res) => {
  const { categoria, search } = req.query;

  try {
    let query = `
      SELECT
        p.id AS product_id,
        p.nombre,
        p.imagen,
        p.descripcion,
        c.nombre AS nombre_categoria,
        p.categoria_id,

        v.id AS variante_id,
        v.almacenamiento,
        v.ram,
        v.precio,
        v.stock,
        v.sku

      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN producto_variantes v ON p.id = v.product_id
    `;

    const values = [];
    const conditions = [];

    if (categoria) {
      conditions.push("c.nombre = ?");
      values.push(categoria);
    }

    if (search) {
      conditions.push("p.nombre LIKE ?");
      values.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const [rows] = await pool.query(query, values);

    
    // AGRUPAR PRODUCTOS
    const productosMap = {};

    rows.forEach((row) => {
      if (!productosMap[row.product_id]) {
        productosMap[row.product_id] = {
          id: row.product_id,
          nombre: row.nombre,
          imagen: row.imagen,
          descripcion: row.descripcion,
          nombre_categoria: row.nombre_categoria,
          categoria_id: row.categoria_id,
          variantes: [],
        };
      }

      if (row.variant_id) {
        productosMap[row.product_id].variantes.push({
          id: row.variant_id,
          almacenamiento: row.almacenamiento,
          ram: row.ram,
          precio: row.precio,
          stock: row.stock,
          sku: row.sku,
        });
      }
    });


    // CONVERTIR A ARRAY + PRECIO MINIMO
    const productos = Object.values(productosMap).map((product) => {
      const precios = product.variantes.map((v) => v.precio);

      return {
        ...product,
        precio_min: precios.length ? Math.min(...precios) : null,
      };
    });

    res.status(200).json(productos);

  } catch (error) {
    res.status(500).json({
      message: "No se pudo obtener los productos",
      error: error.message,
    });
  }
};


// CREAR PRODUCTO (SIN PRECIO NI STOCK)
export const createProducto = async (req, res) => {
  const { nombre, categoria_id, descripcion } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  try {
    const [result] = await pool.query(
      "INSERT INTO productos (nombre, categoria_id, descripcion, imagen) VALUES (?, ?, ?, ?)",
      [nombre, categoria_id, descripcion, imagePath]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      categoria_id,
      descripcion,
      imagen: imagePath,
    });

  } catch (error) {
    res.status(500).json({
      message: "No se pudo crear el producto",
      error: error.message,
    });
  }
};


// UPDATE PRODUCTO (SIN PRECIO NI STOCK)
export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria_id, descripcion } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  try {
    let query = `
      UPDATE productos 
      SET nombre = ?, categoria_id = ?, descripcion = ?
    `;

    let values = [nombre, categoria_id, descripcion];

    if (imagePath) {
      query += `, imagen = ?`;
      values.push(imagePath);
    }

    query += ` WHERE id = ?`;
    values.push(id);

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: `Producto con ID ${id} no encontrado`,
      });
    }

    res.status(200).json({
      message: "Producto actualizado correctamente",
    });

  } catch (error) {
    res.status(500).json({
      message: "No se pudo modificar el producto",
      error: error.message,
    });
  }
};


// DELETE PRODUCTO
export const deleteProducto = async (req, res) => {
  const { id } = req.params;

  try {
    // Primero eliminar variantes
    await pool.query("DELETE FROM product_variants WHERE product_id = ?", [id]);

    // Luego eliminar producto
    const [result] = await pool.query(
      "DELETE FROM productos WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json({
      message: "Producto eliminado correctamente",
    });

  } catch (error) {
    res.status(500).json({
      message: "No se pudo eliminar el producto",
      error: error.message,
    });
  }
};