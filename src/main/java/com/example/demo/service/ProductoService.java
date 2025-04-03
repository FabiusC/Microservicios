package com.example.demo.service;

import com.example.demo.model.Producto;
import java.util.List;

public interface ProductoService {
    List<Producto> obtenerTodos();

    Producto obtenerPorId(Long id);

    Producto crearProducto(Producto producto);

    Producto actualizarProducto(Long id, Producto producto);

    void eliminarProducto(Long id);

}