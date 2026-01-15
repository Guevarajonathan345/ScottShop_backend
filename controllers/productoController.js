import pool from "../db.js";

//LEER PRODUCTO
export const getProductos = async (req, res) => {
    try {
        const query = 
    `SELECT
     p.id,
     p.nombre, 
     p.precio, 
     p.stock, 
     c.nombre AS nombre_categoria, 
     p.categoria_id FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id`;

        const [rows] = await pool.query(query);
        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({message: "No se pudo obtener los productos", error: error.message})
    }
};

//CREAR PRODUCTOS

export const createProducto = async (req, res) => {
    const {nombre, precio, stock, categoria_id } = req.body;
    try {
        const [result] = await pool.query ( 
            'INSERT INTO productos (nombre, precio, stock, categoria_id) VALUES (?, ?, ?, ? )',
            [nombre, precio, stock, categoria_id]
        );
        res.status(201).json ({id: result.id, nombre, precio, stock, categoria_id});
    }catch (error) {
        res.status(500).json({message: "No se pudo crear el producto", error: error.message})
    }
};
//MODIFICAR PRODUCTOS 

export const updateProducto = async (req, res) => {
    const { id } = req.params;
    const {nombre, precio, stock, categoria_id} = req.body;
    try {
        const [result] = await pool.query( 
            `UPDATE productos SET nombre = ?, 
            precio = ?, 
            stock = ?, 
            categoria_id = ? where id = ?`, 
            [ nombre, precio, stock, categoria_id, id]
        );
         if (result.affectedRows === 0) {
            // Si affectedRows es 0, significa que el ID no existía
            return res.status(404).json({ message: `Producto con ID ${id} no encontrado para actualizar.` });
        }
        
        res.status(200).json({ message: "Producto modificado con éxito" }); 
    } catch (error) {
        res.status(500).json({message: "No se pudo modificar el producto", error: error.message})
    }   
};

//ELIMINAR PRODUCTO

export const deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query(
            'DELETE FROM productos where id = ?', [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Este producto no se encontro'});
        }
        else {
            res.json ({message: 'Producto eliminado correctamente'});
        }
    } catch (error) {
        res.status(500).json({message: "No se pudo eliminar el producto", error: error.message})
    }
};

