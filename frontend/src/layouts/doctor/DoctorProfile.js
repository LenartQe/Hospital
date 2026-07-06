import { useEffect, useState } from "react";
import { UserCircle, Stethoscope, Mail, Phone, Building2, Pencil } from "lucide-react";
import { hospitalApi, parseApiError } from "api/hospitalApi";
import DoctorPortalLayout from "./DoctorPortalLayout";
import PageHeader from "./components/PageHeader";
import PatientAvatar from "./components/PatientAvatar";
import PrimaryButton from "./components/PrimaryButton";

const DOCTOR_PLACEHOLDER =
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face";

export default function DoctorProfile() {
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalApi.doctor
      .profile()
      .then(setDoc)
      .catch((e) => setError(parseApiError(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DoctorPortalLayout pageTitle="Profili im">
      <PageHeader
        title="Profili im"
        subtitle="Informacioni juaj profesional klinik"
        icon={UserCircle}
      />

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : doc ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
          <div className="grid lg:grid-cols-3">
            {/* Photo column */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/50 p-8 lg:col-span-1">
              <div className="relative">
                <PatientAvatar
                  name={doc.fullName}
                  imageUrl={doc.imageUrl || DOCTOR_PLACEHOLDER}
                  size="xl"
                />
                <span
                  className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-500"
                  title="Online"
                />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">{doc.fullName}</h2>
              {doc.specialty ? (
                <p className="mt-1 text-sm text-slate-500">{doc.specialty}</p>
              ) : null}
            </div>

            {/* Info column */}
            <div className="p-8 lg:col-span-2">
              {doc.departmentName || doc.department?.name ? (
                <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700">
                  <Building2 size={16} />
                  {doc.departmentName || doc.department?.name}
                </div>
              ) : null}

              <div className="space-y-4">
                {doc.specialty ? (
                  <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <Stethoscope size={18} className="mt-0.5 shrink-0 text-blue-500" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Specialiteti
                      </p>
                      <p className="mt-0.5 font-medium text-slate-800">{doc.specialty}</p>
                    </div>
                  </div>
                ) : null}

                {doc.email ? (
                  <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <Mail size={18} className="mt-0.5 shrink-0 text-blue-500" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Email
                      </p>
                      <p className="mt-0.5 font-medium text-slate-800">{doc.email}</p>
                    </div>
                  </div>
                ) : null}

                {doc.phone ? (
                  <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <Phone size={18} className="mt-0.5 shrink-0 text-blue-500" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Telefoni
                      </p>
                      <p className="mt-0.5 font-medium text-slate-800">{doc.phone}</p>
                    </div>
                  </div>
                ) : null}

                {doc.bio ? (
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Biografia
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{doc.bio}</p>
                  </div>
                ) : null}
              </div>

              <div className="mt-8">
                <PrimaryButton variant="ghost" disabled className="opacity-60">
                  <Pencil size={16} />
                  Ndrysho Profilin
                </PrimaryButton>
                <p className="mt-2 text-xs text-slate-400">
                  Redaktimi i profilit do të jetë i disponueshëm së shpejti.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </DoctorPortalLayout>
  );
}
