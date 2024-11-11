

  // Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  // Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu Cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Revisar el password
  // en el modelo Usuario ya esta esa funcion comprobarPassword
  // y le enviamos el password, asi dentro del modelo compara la password del formulario y database
  if (await usuario.comprobarPassword(password)) {
    // Autenticar
    //genero el token
    const token = generarJWT(usuario.id)
    console.log("el token del usuario es:   ", token)
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token,
    });
  } else {
    const error = new Error("El Password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }