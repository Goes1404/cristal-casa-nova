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

export default function AdminNewProperty() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [isAdmin, setIsAdmin] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parking, setParking] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState("apartamento");
  const [isFeatured, setIsFeatured] = useState(false);
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
          console.error(error);
          if (mounted) setIsAdmin(false);
          return;
        }
        const hasAdmin = Array.isArray(roles) && roles.some((r) => r.role === "admin");
        if (mounted) setIsAdmin(Boolean(hasAdmin));
      } catch (err) {
        console.error(err);
        if (mounted) setIsAdmin(false);
      }
    };
    checkAdmin();
    return () => (mounted = false);
  }, []);

  const mutation = useMutation({
    mutationFn: createProperty,
    onSuccess: (data) => {
      qc.invalidateQueries(["properties"]);
      navigate("/admin"); // ou para a listagem de admin
    },
    onError: (err) => {
      setFormError(err.message || "Erro ao salvar imóvel");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    if (!isAdmin) {
      setFormError("Você precisa ser administrador para criar imóveis.");
      return;
    }
    if (!title.trim() || !location.trim()) {
      setFormError("Preencha título e localização.");
      return;
    }

    const payload = {
      title: title.trim(),
      location: location.trim(),
      price: price ? Number(price) : null,
      bedrooms: bedrooms ? Number(bedrooms) : 0,
      bathrooms: bathrooms ? Number(bathrooms) : 0,
      parking: parking ? Number(parking) : 0,
      area: area ? Number(area) : null,
      type,
      is_featured: Boolean(isFeatured),
      created_at: new Date().toISOString(),
    };

    mutation.mutate(payload);
  };

  if (isAdmin === null) return <div>Carregando permissões...</div>;
  if (!isAdmin) return <div>Você precisa ser administrador para adicionar imóveis.</div>;

  return (
    <div className="p-4 max-w-2xl">
      <h1 className="text-2xl mb-4">Cadastrar Imóvel</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block">Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full" />
        </div>

        <div>
          <label className="block">Localização</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full" />
        </div>

        <div>
          <label className="block">Preço</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="text" className="w-full" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block">Quartos</label>
            <input value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} type="text" className="w-full" />
          </div>
          <div>
            <label className="block">Banheiros</label>
            <input value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} type="text" className="w-full" />
          </div>
          <div>
            <label className="block">Vagas</label>
            <input value={parking} onChange={(e) => setParking(e.target.value)} type="text" className="w-full" />
          </div>
        </div>

        <div>
          <label className="block">Área (m²)</label>
          <input value={area} onChange={(e) => setArea(e.target.value)} type="text" className="w-full" />
        </div>

        <div>
          <label className="block">Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full">
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="cobertura">Cobertura</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>

        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="mr-2" />
            Marcar como destaque
          </label>
        </div>

        <div>
          <button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Salvando..." : "Salvar imóvel"}
          </button>
        </div>

        {formError && <p className="text-red-600 mt-2">{formError}</p>}
        {mutation.isError && <p className="text-red-600 mt-2">Erro: {mutation.error?.message}</p>}
      </form>
    </div>
  );
}