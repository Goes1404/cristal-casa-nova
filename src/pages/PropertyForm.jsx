import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const createProperty = async (payload) => {
  const { data, error } = await supabase
    .from("properties")
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
};

const PropertyForm = ({ onSuccess } = {}) => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [isAdmin, setIsAdmin] = useState(null); // null = loading, false = not admin, true = admin
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser();
        const userId = userRes?.user?.id;
        if (!userId) {
          if (mounted) setIsAdmin(false);
          return;
        }

        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);

        if (error) {
          console.error("Erro ao buscar roles:", error);
          if (mounted) setIsAdmin(false);
          return;
        }

        const hasAdmin = Array.isArray(roles) && roles.some((r) => r.role === "admin");
        if (mounted) setIsAdmin(Boolean(hasAdmin));
      } catch (err) {
        console.error("Erro auth:", err);
        if (mounted) setIsAdmin(false);
      }
    };

    checkAdmin();
    return () => {
      mounted = false;
    };
  }, []);

  const mutation = useMutation({
    mutationFn: createProperty,
    onSuccess: (data) => {
      qc.invalidateQueries(["properties"]);
      if (onSuccess) onSuccess(data);
      else navigate("/admin");
    },
    onError: (err) => {
      setFormError(err.message || "Erro ao salvar imóvel");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!isAdmin) {
      setFormError("Você não tem permissão para criar imóveis.");
      return;
    }

    if (!name.trim() || !address.trim()) {
      setFormError("Preencha nome e endereço.");
      return;
    }

    const payload = {
      title: name.trim(), // ajustar campo para seu schema: aqui usa title
      location: address.trim(), // ajustar campo para seu schema: aqui usa location
      price: price ? Number(price) : null,
      created_at: new Date().toISOString(),
    };

    mutation.mutate(payload);
  };

  if (isAdmin === null) return <div>Carregando permissões...</div>;
  if (!isAdmin) return <div>Você precisa ser administrador para adicionar imóveis.</div>;

  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-2xl mb-4">Novo Imóvel</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block">Endereço</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            name="address"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block">Preço</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            name="price"
            type="number"
            className="w-full"
          />
        </div>

        <div>
          <button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Salvando..." : "Salvar"}
          </button>
        </div>

        {formError && <p className="text-red-600 mt-2">{formError}</p>}
        {mutation.isError && (
          <p className="text-red-600 mt-2">Erro: {mutation.error?.message}</p>
        )}
      </form>
    </div>
  );
};

export default PropertyForm;