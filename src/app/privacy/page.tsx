import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Política de Privacidade — Velo" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/auth/register/student" className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">Política de Privacidade</h1>
            <p className="text-xs text-slate-400 mt-0.5">Versão 1.0 · Maio de 2026 · LGPD (Lei 13.709/2018)</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">

        {/* Intro */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-800 leading-relaxed">
          Esta Política descreve como o Velo coleta, utiliza, armazena e protege os dados pessoais dos seus usuários, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD — Lei Federal n.º 13.709/2018)</strong>.
        </section>

        {/* Controlador + DPO */}
        <section className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Controlador dos dados" content={["Plataforma Velo", "privacidade@velo.app"]} />
          <InfoCard title="Encarregado de Dados (DPO)" content={["Responsável pelos direitos dos titulares e comunicação com a ANPD.", "dpo@velo.app"]} />
        </section>

        {/* Part 3 */}
        <section className="space-y-8">
          <SectionTitle label="Parte 3" title="Política de Privacidade" />

          <Article title="3.3 Dados coletados e finalidade">
            <p className="mb-4 font-medium text-slate-700">Dados do Aluno</p>
            <DataTable rows={[
              ["Nome completo", "Identificação e personalização", "Execução de contrato (art. 7º, V)"],
              ["E-mail", "Comunicações e autenticação", "Execução de contrato (art. 7º, V)"],
              ["Telefone", "Contato e notificações", "Execução de contrato (art. 7º, V)"],
              ["CPF", "Verificação de identidade e emissão de recibos", "Obrigação legal (art. 7º, II)"],
              ["Localização", "Busca de instrutores próximos", "Consentimento (art. 7º, I)"],
              ["Histórico de aulas", "Progresso do aluno e suporte", "Execução de contrato (art. 7º, V)"],
              ["Fotos de check-in/check-out", "Comprovação de realização da aula", "Execução de contrato (art. 7º, V)"],
              ["Dados de pagamento", "Processamento financeiro via Stripe", "Execução de contrato (art. 7º, V)"],
            ]} />

            <p className="mt-6 mb-4 font-medium text-slate-700">Dados do Instrutor</p>
            <DataTable rows={[
              ["Nome completo", "Identificação pública no perfil", "Execução de contrato (art. 7º, V)"],
              ["E-mail e telefone", "Comunicações e autenticação", "Execução de contrato (art. 7º, V)"],
              ["CPF", "Verificação e repasse financeiro", "Obrigação legal (art. 7º, II)"],
              ["Número da CIP", "Exibição pública obrigatória no perfil", "Obrigação legal (art. 7º, II)"],
              ["CNH (cópia digital)", "Verificação de habilitação EAR", "Obrigação legal (art. 7º, II)"],
              ["Certidão Negativa Criminal", "Verificação de idoneidade", "Obrigação legal (art. 7º, II)"],
              ["Apólice de seguro", "Verificação de cobertura ativa", "Obrigação legal (art. 7º, II)"],
              ["Dados do veículo", "Verificação de regularidade", "Obrigação legal (art. 7º, II)"],
              ["Avaliações recebidas", "Exibição pública no perfil", "Legítimo interesse (art. 7º, IX)"],
            ]} />
          </Article>

          <Article title="3.4 Compartilhamento de dados">
            <p className="mb-2">O Velo <strong>não vende dados pessoais</strong> a terceiros. Os dados são compartilhados apenas nas seguintes situações:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Entre aluno e instrutor:</strong> nome, foto de perfil e histórico de aulas são compartilhados para viabilizar a prestação do serviço.</li>
              <li><strong>Stripe:</strong> dados financeiros para processar transações. A Stripe possui certificação PCI-DSS.</li>
              <li><strong>Neon.tech:</strong> armazenamento seguro com Row Level Security (RLS) ativo.</li>
              <li><strong>Autoridades competentes:</strong> quando exigido por lei, ordem judicial ou requisição do DETRAN.</li>
            </ul>
          </Article>

          <Article title="3.5 Prazo de retenção de dados">
            <DataTable headers={["Tipo de dado", "Prazo de retenção"]} rows={[
              ["Dados de cadastro (nome, e-mail, CPF)", "Enquanto a conta estiver ativa + 5 anos após exclusão"],
              ["Histórico de aulas e pagamentos", "5 anos (prazo fiscal — Lei n.º 9.430/1996)"],
              ["Fotos de check-in/check-out", "2 anos após a realização da aula"],
              ["Documentos do instrutor (CIP, CNH, certidões)", "Enquanto o perfil estiver ativo + 1 ano após encerramento"],
              ["Dados de localização", "Sessão atual apenas — não são armazenados permanentemente"],
              ["Logs de acesso e autenticação", "6 meses (art. 15 do Marco Civil da Internet)"],
            ]} />
          </Article>

          <Article title="3.6 Seus direitos como titular">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ["Acesso", "Confirmar a existência e acessar seus dados"],
                ["Correção", "Atualizar dados incompletos ou incorretos"],
                ["Anonimização", "Solicitar bloqueio de dados desnecessários"],
                ["Eliminação", "Excluir dados tratados com base em consentimento"],
                ["Portabilidade", "Transferir seus dados a outro fornecedor"],
                ["Revogação", "Revogar o consentimento a qualquer momento"],
              ].map(([right, desc]) => (
                <div key={right} className="bg-white border border-slate-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-blue-600 mb-0.5">{right}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Para exercer qualquer um desses direitos, entre em contato: <a href="mailto:privacidade@velo.app" className="text-blue-600 font-medium">privacidade@velo.app</a>. Prazo de resposta: até <strong>15 dias úteis</strong>.
            </p>
          </Article>

          <Article title="3.7 Segurança dos dados">
            <ul className="list-disc pl-5 space-y-1">
              <li>Armazenamento PostgreSQL (Neon.tech) com <strong>criptografia em repouso</strong>.</li>
              <li><strong>Row Level Security (RLS):</strong> cada usuário acessa apenas seus próprios dados.</li>
              <li>Comunicações protegidas por <strong>HTTPS/TLS</strong>.</li>
              <li>Autenticação com sessão persistente e tokens seguros.</li>
            </ul>
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
              Em caso de incidente de segurança, o Velo notificará a <strong>ANPD e os usuários afetados</strong> em até 72 horas, conforme art. 48 da LGPD.
            </div>
          </Article>

          <Article title="3.8 Política de cookies">
            <DataTable headers={["Tipo", "Finalidade", "Pode ser desativado?"]} rows={[
              ["Essenciais", "Manter a sessão do usuário autenticado", "Não"],
              ["Funcionais", "Salvar preferências de busca e filtros", "Sim"],
              ["Analíticos", "Medir uso do app sem identificação pessoal", "Sim"],
            ]} />
          </Article>

          <Article title="3.9 Transferência internacional de dados">
            <p>Os dados são armazenados em servidores da <strong>Neon.tech</strong> e <strong>Vercel</strong>, que podem estar localizados fora do Brasil. Ambas possuem políticas de proteção compatíveis com o GDPR e a LGPD.</p>
          </Article>

          <Article title="3.10 Alterações nesta política">
            <p>Alterações relevantes serão comunicadas ao usuário por notificação no aplicativo com antecedência mínima de <strong>15 dias</strong>. O uso continuado da plataforma após a data de vigência implica aceite das novas condições.</p>
          </Article>
        </section>

        <hr className="border-slate-200" />

        <section className="space-y-6">
          <SectionTitle label="Contato" title="Fale com o Velo" />
          <div className="grid sm:grid-cols-3 gap-3">
            <ContactCard label="Suporte geral" email="suporte@velo.app" />
            <ContactCard label="Privacidade e LGPD" email="privacidade@velo.app" />
            <ContactCard label="DPO" email="dpo@velo.app" />
          </div>
        </section>

        <footer className="text-center text-xs text-slate-400 pt-4 pb-8">
          Última atualização: Maio de 2026 · Versão 1.0 — Plataforma Velo
        </footer>
      </main>
    </div>
  );
}

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">{label}</span>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <div className="text-sm text-slate-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function InfoCard({ title, content }: { title: string; content: string[] }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{title}</p>
      {content.map((line, i) => (
        <p key={i} className={`text-sm ${i === 0 ? "font-semibold text-slate-800" : "text-blue-600"}`}>{line}</p>
      ))}
    </div>
  );
}

function ContactCard({ label, email }: { label: string; email: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 text-center">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <a href={`mailto:${email}`} className="text-sm font-medium text-blue-600 hover:underline">{email}</a>
    </div>
  );
}

function DataTable({ headers, rows }: { headers?: string[]; rows: string[][] }) {
  const defaultHeaders = rows[0].length === 3 ? ["Dado", "Finalidade", "Base Legal (LGPD)"] : ["Dado", "Detalhe"];
  const cols = headers ?? defaultHeaders;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100">
            {cols.map((h) => (
              <th key={h} className="text-left p-3 font-semibold text-slate-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={i} className="bg-white even:bg-slate-50/50">
              {row.map((cell, j) => (
                <td key={j} className={`p-3 ${j === 0 ? "font-medium text-slate-700" : "text-slate-500"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
