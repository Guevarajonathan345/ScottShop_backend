import pool from "../db.js";


// =====================================
// 🟢 GET PRODUCTOS (LISTA + FILTROS)
// =====================================
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

        v.id AS variantes_id,
        v.almacenamiento,
        v.ram,
        v.precio,
        v.stock,
        v.sku

      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN productos_variantes v ON p.id = v.product_id
    `;

    const values = [];
    const conditions = [];

    // FILTRO CATEGORIA
    if (categoria) {
      conditions.push("c.nombre = ?");
      values.push(categoria);
    }

    // FILTRO BUSQUEDA
    if (search) {
      conditions.push("p.nombre LIKE ?");
      values.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const [rows] = await pool.query(query, values);

    // AGRUPAR
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

      if (row.variantes_id) {
        productosMap[row.product_id].variantes.push({
          id: row.variantes_id,
          almacenamiento: row.almacenamiento,
          ram: row.ram,
          precio: row.precio,
          stock: row.stock,
          sku: row.sku,
        });
      }
    });

    // PRECIO MINIMO
    const productos = Object.values(productosMap).map((product) => {
      const precios = product.variantes.map((v) => v.precio);

      return {
        ...product,
        precio_min: precios.length ? Math.min(...precios) : null,
      };
    });

    res.json(productos);

  } catch (error) {
    res.status(500).json({
      message: "No se pudo obtener los productos",
      error: error.message,
    });
  }
};


// =====================================
// 🔵 GET PRODUCTO POR ID (DETALLE)
// =====================================
export const getProductoById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT
        p.id AS product_id,
        p.nombre,
        p.imagen,
        p.descripcion,
        c.nombre AS nombre_categoria,
        p.categoria_id,

        v.id AS variantes_id,
        v.almacenamiento,
        v.ram,
        v.precio,
        v.stock,
        v.sku

      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN productos_variantes v ON p.id = v.product_id
      WHERE p.id = ?
    `;

    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    const producto = {
      id: rows[0].product_id,
      nombre: rows[0].nombre,
      imagen: rows[0].imagen,
      descripcion: rows[0].descripcion,
      nombre_categoria: rows[0].nombre_categoria,
      categoria_id: rows[0].categoria_id,
      variantes: [],
    };

    rows.forEach((row) => {
      if (row.variantes_id) {
        producto.variantes.push({
          id: row.variantes_id,
          almacenamiento: row.almacenamiento,
          ram: row.ram,
          precio: row.precio,
          stock: row.stock,
          sku: row.sku,
        });
      }
    });

    const precios = producto.variantes.map((v) => v.precio);

    producto.precio_min = precios.length
      ? Math.min(...precios)
      : null;

    res.json(producto);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el producto",
      error: error.message,
    });
  }
};


// =====================================
// 🟡 CREATE PRODUCTO
// =====================================
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


// =====================================
// 🟠 UPDATE PRODUCTO
// =====================================
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
        message: "Producto no encontrado",
      });
    }

    res.json({ message: "Producto actualizado" });

  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar producto",
      error: error.message,
    });
  }
};


// =====================================
// 🔴 DELETE PRODUCTO
// =====================================
export const deleteProducto = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM productos_variantes WHERE product_id = ?",
      [id]
    );

    const [result] = await pool.query(
      "DELETE FROM productos WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json({ message: "Producto eliminado" });

  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar producto",
      error: error.message,
    });
  }
};