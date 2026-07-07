/** Shared image URLs for the public hospital site (with fallbacks where noted). */

export const HOSPITAL_EXTERIOR =
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=700&fit=crop";

export const DOCTOR_PFP = {
  sara: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
  kadri: "/images/hospital/kadri-mustafa.png",
  emir: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
  lenart: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
  mimoza: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
  blerdon: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=400&fit=crop&crop=face",
};

export const DOCTOR_PFP_FALLBACK = DOCTOR_PFP.lenart;

/** Primary + fallback URLs per service title. */
export const SERVICE_IMAGES = {
  Ambulanca: [
    "/images/hospital/ambulanca.png",
    "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=600&h=400&fit=crop",
  ],
  Emergjenca: [
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop",
  ],
  Barnatorja: [
    "/images/hospital/barnatorja-pills.png",
    "https://images.unsplash.com/photo-1584308664894-6d0f743df229?w=600&h=400&fit=crop",
  ],
  Diagnostika: [
    "/images/hospital/diagnostika.png",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
  ],
};

const DEPT_IMAGE_RULES = [
  {
    match: (n) => n.includes("kardio") || n.includes("cardio"),
    images: [
      "/images/hospital/kardiologji-heart.png",
      "https://images.unsplash.com/photo-1478779469176-1df4b0daf9c5?w=600&h=360&fit=crop",
    ],
    icon: "icofont-heart-beat",
    imageClass: "hospital-dept-card__img--diagram",
  },
  {
    match: (n) => n.includes("pediat") || n.includes("fëmij"),
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e317ddd2?w=600&h=360&fit=crop",
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=360&fit=crop",
    ],
    icon: "icofont-kid",
  },
  {
    match: (n) => n.includes("onkolog") || n.includes("oncolog"),
    images: [
      "/images/hospital/onkologji.png",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=360&fit=crop",
    ],
    icon: "icofont-prescription",
  },
  {
    match: (n) => n.includes("psikiatr") || n.includes("psychiat") || n.includes("psikolog"),
    images: [
      "/images/hospital/psikiatri.png",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Brain_human_sagittal_section.svg/800px-Brain_human_sagittal_section.svg.png",
    ],
    icon: "icofont-brain",
  },
  {
    match: (n) => n.includes("neuro"),
    images: [
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=360&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=360&fit=crop",
    ],
    icon: "icofont-brain-alt",
  },
  {
    match: (n) => n.includes("kirurg") || n.includes("surg"),
    images: [
      "https://images.unsplash.com/photo-1551190822-a933c7318e11?w=600&h=360&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=360&fit=crop",
    ],
    icon: "icofont-surgeon",
  },
];

const DEPT_DEFAULT = {
  images: [
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=360&fit=crop",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=360&fit=crop",
  ],
  icon: "icofont-hospital",
};

export function deptVisual(name) {
  const n = (name || "").toLowerCase();
  for (const rule of DEPT_IMAGE_RULES) {
    if (rule.match(n)) {
      return { images: rule.images, icon: rule.icon, imageClass: rule.imageClass || "" };
    }
  }
  return { ...DEPT_DEFAULT, imageClass: "" };
}

export function doctorPhoto(doc) {
  const name = (doc?.fullName || "").toLowerCase();
  if (name.includes("sara")) return DOCTOR_PFP.sara;
  if (name.includes("kadri")) return DOCTOR_PFP.kadri;
  if (name.includes("emir")) return DOCTOR_PFP.emir;
  if (name.includes("lenart")) return DOCTOR_PFP.lenart;
  if (name.includes("mimoza")) return DOCTOR_PFP.mimoza;
  if (name.includes("blerdon")) return DOCTOR_PFP.blerdon;
  return doc?.imageUrl || DOCTOR_PFP_FALLBACK;
}
