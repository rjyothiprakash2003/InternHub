import { InternHubLogo } from "@/components/brand/logo";
import { formatDate } from "@/lib/utils";

type DocData = {
  publicId: string;
  studentName: string;
  college: string;
  course?: string;
  branch?: string;
  domain: string;
  duration: string;
  startDate: Date;
  endDate: Date;
  issueDate: Date;
  qrDataUrl?: string;
  verificationUrl: string;
  grade?: string | null;
};

export function OfferLetterPreview({ data }: { data: DocData }) {
  return (
    <article className="mx-auto max-w-3xl rounded-[32px] border-[12px] border-[#071529] bg-white p-8 shadow-xl print:border-8">
      <div className="flex items-start justify-between">
        <InternHubLogo />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Offer Letter</p>
      </div>
      <h1 className="mt-8 text-center text-3xl font-semibold text-[var(--ih-navy)]">Internship Offer Letter</h1>
      <p className="mt-2 text-center text-sm text-slate-500">{data.publicId}</p>
      <p className="mt-8 leading-8 text-slate-700">
        This letter confirms that <strong>{data.studentName}</strong> of <strong>{data.college}</strong>
        {data.course ? `, ${data.course}` : ""}
        {data.branch ? ` (${data.branch})` : ""} is offered an InternHub internship in <strong>{data.domain}</strong> for a duration of <strong>{data.duration}</strong>, commencing on <strong>{formatDate(data.startDate)}</strong> and ending on <strong>{formatDate(data.endDate)}</strong>.
      </p>
      <p className="mt-4 text-sm text-slate-600">Issue date: {formatDate(data.issueDate)}</p>
      <div className="mt-10 flex items-end justify-between">
        <div>
          <div className="h-px w-40 bg-slate-400" />
          <p className="mt-2 text-sm text-slate-500">Authorized signature</p>
          <p className="text-sm font-semibold text-[var(--ih-navy)]">InternHub Operations</p>
        </div>
        {data.qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.qrDataUrl} alt="Offer letter verification QR code" className="h-24 w-24" />
        ) : null}
      </div>
      <p className="mt-6 text-xs text-slate-500">Verify: {data.verificationUrl}</p>
    </article>
  );
}

export function CertificatePreview({ data }: { data: DocData }) {
  return (
    <article className="mx-auto max-w-3xl rounded-[36px] border-[14px] border-[#163a6b] bg-[linear-gradient(180deg,#ffffff,#f4f7ff)] p-10 shadow-2xl">
      <div className="flex justify-center">
        <InternHubLogo />
      </div>
      <p className="mt-6 text-center text-xs uppercase tracking-[0.25em] text-[var(--ih-blue)]">Certificate of Internship Completion</p>
      <h1 className="mt-4 text-center text-4xl font-semibold text-[var(--ih-navy)]">{data.studentName}</h1>
      <p className="mt-6 text-center leading-8 text-slate-700">
        has successfully completed the InternHub internship in <strong>{data.domain}</strong>
        {data.college ? ` while enrolled at ${data.college}` : ""}, duration <strong>{data.duration}</strong>, from {formatDate(data.startDate)} to {formatDate(data.endDate)}.
      </p>
      {data.grade ? <p className="mt-3 text-center text-sm">Performance: {data.grade}</p> : null}
      <p className="mt-6 text-center text-sm text-slate-500">Certificate ID: {data.publicId}</p>
      <p className="text-center text-sm text-slate-500">Issue date: {formatDate(data.issueDate)}</p>
      <div className="mt-10 flex items-end justify-between">
        <div>
          <div className="h-px w-40 bg-slate-400" />
          <p className="mt-2 text-sm text-slate-500">Authorized signature</p>
        </div>
        {data.qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.qrDataUrl} alt="Certificate verification QR code" className="h-24 w-24" />
        ) : null}
      </div>
      <p className="mt-6 text-center text-xs text-slate-500">{data.verificationUrl}</p>
    </article>
  );
}
