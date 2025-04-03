-- Crear tabla productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE USER productos_user WITH PASSWORD 'productos123';
GRANT ALL PRIVILEGES ON DATABASE postgres TO productos_user;

-- Asignar permisos al usuario (si lo creaste)
GRANT ALL PRIVILEGES ON TABLE productos TO productos_user;
GRANT USAGE, SELECT ON SEQUENCE productos_id_seq TO productos_user;

-- Insertar datos iniciales
INSERT INTO productos (nombre, precio, stock) VALUES
('Laptop HP Pavilion', 899.99, 15),
('Mouse Inalámbrico Logitech', 25.50, 40),
('Teclado Mecánico RGB', 75.00, 20),
('Monitor 24" Full HD', 199.99, 10),
('Disco Duro Externo 1TB', 59.99, 25),
('Auriculares Bluetooth', 45.75, 30),
('Webcam 1080p', 65.00, 12),
('Altavoz Inteligente', 89.95, 8),
('Tablet 10 Pulgadas', 159.00, 5),
('Cargador USB-C 65W', 29.99, 50);

-- Consultar todos los productos
SELECT * FROM productos;

-- Consultar productos con stock bajo
SELECT * FROM productos WHERE stock < 10;