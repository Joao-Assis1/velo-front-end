import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Termos de Uso — Velo" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/auth/register/student" className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">Termos de Uso</h1>
            <p className="text-xs text-slate-400 mt-0.5">Versão 1.0 · Maio de 2026</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">

        {/* Intro */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-800 leading-relaxed">
          Este documento reúne os Termos de Uso da plataforma Velo. A leitura e o aceite são obrigatórios para utilização do aplicativo. Ao se cadastrar, você declara ter lido, compreendido e concordado com todas as disposições abaixo.
        </section>

        {/* Part 1 — Alunos */}
        <section className="space-y-6">
          <SectionTitle label="Parte 1" title="Termos de Uso para Alunos" />

          <Article title="1.1 O que é o Velo">
            <p>O Velo é uma plataforma digital de intermediação. Ele conecta você — candidato à Carteira Nacional de Habilitação — a instrutores de trânsito autônomos credenciados pelo DETRAN. <strong>O Velo não é uma autoescola</strong> e não presta diretamente serviços de formação de condutores.</p>
          </Article>

          <Article title="1.2 O que o Velo faz por você">
            <ul className="list-disc pl-5 space-y-1">
              <li>Disponibiliza um canal seguro para encontrar e contratar instrutores credenciados.</li>
              <li>Exibe avaliações reais de outros alunos sobre cada instrutor.</li>
              <li>Facilita o agendamento, a comunicação e o pagamento das aulas.</li>
              <li>Verifica a documentação dos instrutores antes de ativá-los na plataforma.</li>
              <li>Oferece canal de suporte para reclamações e denúncias.</li>
            </ul>
          </Article>

          <Article title="1.3 O que o Velo NÃO garante">
            <Callout color="amber">
              O Velo <strong>NÃO</strong> garante aprovação nas provas do DETRAN. Qualquer promessa de "aprovação garantida" é vedada pela plataforma e pode caracterizar prática enganosa.
            </Callout>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li>O Velo não se responsabiliza por faltas, atrasos ou comportamentos inadequados do instrutor.</li>
              <li>O Velo não garante disponibilidade de instrutores em todas as regiões.</li>
              <li>O Velo não é responsável por danos ocorridos durante a aula — esta responsabilidade é do instrutor e coberta pelo seguro profissional exigido.</li>
            </ul>
          </Article>

          <Article title="1.4 Contratação direta com o instrutor">
            <p>Ao agendar uma aula pelo Velo, você está firmando um contrato diretamente com o instrutor. O Velo atua apenas como intermediador da relação. Eventuais conflitos devem ser reportados pelo canal de suporte do app.</p>
          </Article>

          <Article title="1.5 Pagamentos e cancelamentos">
            <ul className="list-disc pl-5 space-y-1">
              <li>O pagamento é processado de forma segura pela plataforma via Stripe.</li>
              <li>Cancelamentos com <strong>mais de 24 horas de antecedência</strong> dão direito a reembolso integral.</li>
              <li>Cancelamentos com <strong>menos de 24 horas de antecedência</strong> estão sujeitos à política de reembolso disponível nas configurações do app.</li>
              <li>O Velo emite comprovante de todas as transações realizadas.</li>
            </ul>
          </Article>

          <Article title="1.6 Conduta esperada do aluno">
            <ul className="list-disc pl-5 space-y-1">
              <li>Fornecer informações verdadeiras no cadastro.</li>
              <li>Comparecer às aulas agendadas ou cancelar com antecedência mínima de 24 horas.</li>
              <li>Tratar o instrutor com respeito e urbanidade.</li>
              <li>Utilizar o canal de denúncias de forma responsável e verídica.</li>
            </ul>
          </Article>

          <Article title="1.7 Encerramento de conta">
            <p>Você pode solicitar a exclusão da sua conta a qualquer momento pelas configurações do aplicativo. A exclusão implica a remoção dos seus dados pessoais, respeitados os prazos de retenção legais descritos na Política de Privacidade.</p>
          </Article>
        </section>

        <Divider />

        {/* Part 2 — Instrutores */}
        <section className="space-y-6">
          <SectionTitle label="Parte 2" title="Termos de Uso para Instrutores" />

          <Article title="2.1 Requisitos obrigatórios para cadastro">
            <p className="mb-3">Para ser ativado na plataforma, o instrutor deve apresentar e manter válidos os seguintes documentos:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left p-3 rounded-tl-lg font-semibold text-slate-700">Documento</th>
                    <th className="text-left p-3 rounded-tr-lg font-semibold text-slate-700">Exigência</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["Carteira de Identificação Profissional (CIP)", "Emitida pelo SENATRAN. Validade anual (vence em 31/12). O número deve ser exibido publicamente no perfil."],
                    ["CNH com anotação EAR", "CNH válida com observação \"Exerce Atividade Remunerada\". Obrigatória para cobrança legal de aulas."],
                    ["Certificado do Curso de Instrutor", "Reconhecido pelo SENATRAN. Deve ser armazenado pela plataforma."],
                    ["Certidão Negativa Criminal", "Exigida pela Res. CONTRAN 1.020/2025. Validade máxima de 90 dias. Renovação periódica obrigatória."],
                    ["Seguro de Responsabilidade Civil", "Apólice ativa obrigatória. Cobre danos ao aluno durante a aula."],
                    ["Dados do veículo (placa + CRLV)", "Veículo com identificação \"Veículo de Instrução\", dentro do limite de 10 anos de fabricação e com vistoria DETRAN aprovada."],
                  ].map(([doc, req]) => (
                    <tr key={doc} className="bg-white even:bg-slate-50/50">
                      <td className="p-3 font-medium text-slate-800 align-top">{doc}</td>
                      <td className="p-3 text-slate-600">{req}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Article>

          <Article title="2.2 Validade e renovação de credencial">
            <p className="mb-2">A Carteira de Identificação Profissional vence anualmente em 31 de dezembro. O sistema Velo irá:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Enviar notificação de alerta <strong>30 dias antes</strong> do vencimento.</li>
              <li><strong>Bloquear automaticamente</strong> o perfil caso a credencial expire.</li>
              <li>Impedir novos agendamentos enquanto houver documento vencido.</li>
            </ul>
          </Article>

          <Article title="2.3 Obrigações do instrutor na plataforma">
            <ul className="list-disc pl-5 space-y-1">
              <li>Fornecer informações verdadeiras e manter o perfil atualizado.</li>
              <li>Comparecer às aulas agendadas ou cancelar com no mínimo 24 horas de antecedência.</li>
              <li>Tratar alunos com respeito, profissionalismo e urbanidade.</li>
              <li>Registrar as aulas realizadas no sistema oficial do DETRAN.</li>
              <li>Não prometer ou sugerir aprovação garantida nas provas.</li>
              <li>Informar ao Velo qualquer alteração no veículo utilizado para as aulas.</li>
              <li>Realizar o check-in e o check-out de cada aula pelo aplicativo.</li>
            </ul>
          </Article>

          <Article title="2.4 Condutas proibidas">
            <Callout color="red">
              <strong>PROIBIDO:</strong> Listar informações falsas no cadastro; realizar aulas sem credencial válida; cobrar valores fora da plataforma para burlar a taxa de intermediação; fazer publicidade enganosa ou prometer resultados nas provas.
            </Callout>
          </Article>

          <Article title="2.5 Ausência de vínculo empregatício">
            <p>O cadastro e a atuação do instrutor na plataforma Velo <strong>não configuram relação de emprego</strong> com a empresa, nos termos do art. 3º da CLT. O instrutor é profissional autônomo, responsável pela própria atividade e pela gestão de sua agenda.</p>
          </Article>

          <Article title="2.6 Taxa de intermediação">
            <p>O Velo cobra uma taxa de intermediação sobre cada aula realizada, conforme tabela disponível nas configurações do app. O repasse ao instrutor é realizado automaticamente após a conclusão e registro do check-out da aula.</p>
          </Article>

          <Article title="2.7 Suspensão e exclusão de perfil">
            <p className="mb-2">O Velo reserva-se o direito de suspender ou excluir o perfil do instrutor nas seguintes situações:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Documentação vencida não renovada no prazo.</li>
              <li>Recebimento de denúncias graves e verificadas de conduta imprópria.</li>
              <li>Descumprimento dos termos deste documento.</li>
              <li>Determinação de autoridade competente (DETRAN, Poder Judiciário).</li>
            </ul>
          </Article>
        </section>

        <Divider />

        {/* Part 4 — Disposições Gerais */}
        <section className="space-y-6">
          <SectionTitle label="Parte 4" title="Disposições Gerais" />

          <Article title="Legislação aplicável">
            <ul className="list-disc pl-5 space-y-1">
              <li>Lei Federal n.º 8.078/1990 (Código de Defesa do Consumidor)</li>
              <li>Lei Federal n.º 13.709/2018 (LGPD)</li>
              <li>Lei Federal n.º 12.965/2014 (Marco Civil da Internet)</li>
              <li>Resolução CONTRAN n.º 1.020/2025</li>
            </ul>
          </Article>

          <Article title="Foro">
            <p>Fica eleito o foro da <strong>Comarca de Campo Grande, Estado de Mato Grosso do Sul</strong>, para dirimir quaisquer litígios decorrentes destes Termos.</p>
          </Article>

          <Article title="Contato">
            <ul className="space-y-1 text-sm">
              <li><span className="text-slate-500">Suporte geral:</span> <a href="mailto:suporte@velo.app" className="text-blue-600 font-medium">suporte@velo.app</a></li>
              <li><span className="text-slate-500">Privacidade e LGPD:</span> <a href="mailto:privacidade@velo.app" className="text-blue-600 font-medium">privacidade@velo.app</a></li>
            </ul>
          </Article>
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

function Callout({ color, children }: { color: "amber" | "red"; children: React.ReactNode }) {
  const styles = {
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    red: "bg-red-50 border-red-200 text-red-800",
  };
  return (
    <div className={`border rounded-xl p-4 text-sm leading-relaxed ${styles[color]}`}>
      {children}
    </div>
  );
}

function Divider() {
  return <hr className="border-slate-200" />;
}
