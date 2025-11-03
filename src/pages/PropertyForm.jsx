import React from "react";

const PropertyForm = () => {
  return (
    <div>
      <h1>Novo Imóvel</h1>
      <form>
        <label>
          Nome:
          <input type="text" name="name" />
        </label>
        <br />
        <label>
          Endereço:
          <input type="text" name="address" />
        </label>
        <br />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default PropertyForm;