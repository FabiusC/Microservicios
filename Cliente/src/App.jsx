import { useEffect, useState } from 'react'
import './App.css'

const initialForm = {
  nombre: '',
  precio: '',
  stock: '',
};

function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  // Cargar productos
  const fetchProductos = () => {
    setLoading(true);
    fetch('/api/productos')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener productos');
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear producto
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    if (!form.nombre || !form.precio || !form.stock) {
      setMessage('Todos los campos son obligatorios');
      return;
    }
    fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: form.nombre,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al agregar producto');
        setForm(initialForm);
        fetchProductos();
        setMessage('Producto agregado');
      })
      .catch(() => setMessage('Error al agregar producto'));
  };

  // Eliminar producto
  const handleDelete = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    fetch(`/api/productos/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error();
        fetchProductos();
        setMessage('Producto eliminado');
      })
      .catch(() => setMessage('Error al eliminar producto'));
  };

  // Editar producto (mostrar en formulario)
  const handleEdit = (producto) => {
    setEditId(producto.id);
    setForm({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
    });
    setMessage('');
  };

  // Guardar edición
  const handleUpdate = (e) => {
    e.preventDefault();
    setMessage('');
    fetch(`/api/productos/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: form.nombre,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setEditId(null);
        setForm(initialForm);
        fetchProductos();
        setMessage('Producto actualizado');
      })
      .catch(() => setMessage('Error al actualizar producto'));
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditId(null);
    setForm(initialForm);
    setMessage('');
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>Lista de Productos</h1>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
      <form onSubmit={editId ? handleUpdate : handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          step="0.01"
          style={{ marginRight: 8 }}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={handleCancel} style={{ marginLeft: 8 }}>Cancelar</button>}
      </form>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.precio}</td>
              <td>{p.stock}</td>
              <td>{p.fecha_creacion}</td>
              <td>
                <button onClick={() => handleEdit(p)} style={{ marginRight: 8 }}>Editar</button>
                <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
