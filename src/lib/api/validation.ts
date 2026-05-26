import { fetchWrapper } from "../api-client";

type Wrapped<T> = { success: boolean; data: T; message?: string };

export async function validateCpf(cpf: string): Promise<{ valid: boolean }> {
  const res = await fetchWrapper<Wrapped<{ valid: boolean }>>(
    "/validation/cpf",
    { method: "POST", body: JSON.stringify({ cpf }) },
  );
  return res.data;
}

export type CepResult = {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export async function validateCep(cep: string): Promise<CepResult | null> {
  const res = await fetchWrapper<Wrapped<CepResult | null>>(
    `/validation/cep/${cep.replace(/\D/g, "")}`,
  );
  return res.data;
}

export async function validateCnh(cnh: string): Promise<{ valid: boolean }> {
  const res = await fetchWrapper<Wrapped<{ valid: boolean }>>(
    "/validation/cnh",
    { method: "POST", body: JSON.stringify({ cnh }) },
  );
  return res.data;
}
