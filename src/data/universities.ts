export interface University {
  id: string
  name: string
  location: {
    city: string
    state: string
  }
  website: string
  programs: Program[]
  tuition: {
    inState: number
    outOfState: number
    international: number
  }
  scholarships: Scholarship[]
  hasInStateTuitionWaiver: boolean
  ranking: number
  image?: string
}

export interface Program {
  id: string
  name: string
  department: string
  degree: "MS" | "PhD" | "MBA" | "MFA"
  requirements: {
    gpa: number
    gre?: {
      verbal: number
      quantitative: number
      writing: number
    }
    gmat?: number
    toefl?: number
    ielts?: number
    prerequisites: string[]
    applicationDeadline: string
  }
}

export interface Scholarship {
  id: string
  name: string
  amount: number | "Full Tuition"
  eligibility: string[]
  deadline: string
  renewable: boolean
}

export const sampleUniversities: University[] = [
  {
    id: "stanford",
    name: "Stanford University",
    location: { city: "Stanford", state: "CA" },
    website: "https://www.stanford.edu",
    tuition: {
      inState: 58416,
      outOfState: 58416,
      international: 58416
    },
    hasInStateTuitionWaiver: false,
    ranking: 3,
    programs: [
      {
        id: "cs-ms",
        name: "Computer Science",
        department: "Computer Science",
        degree: "MS",
        requirements: {
          gpa: 3.5,
          gre: { verbal: 160, quantitative: 165, writing: 4.0 },
          toefl: 100,
          ielts: 7.0,
          prerequisites: ["Bachelor's in CS or related field", "Programming experience"],
          applicationDeadline: "December 15, 2024"
        }
      }
    ],
    scholarships: [
      {
        id: "stanford-fellowship",
        name: "Stanford Graduate Fellowship",
        amount: "Full Tuition",
        eligibility: ["PhD students", "Exceptional academic record"],
        deadline: "December 1, 2024",
        renewable: true
      }
    ]
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    location: { city: "Cambridge", state: "MA" },
    website: "https://www.mit.edu",
    tuition: {
      inState: 57986,
      outOfState: 57986,
      international: 57986
    },
    hasInStateTuitionWaiver: false,
    ranking: 1,
    programs: [
      {
        id: "eecs-ms",
        name: "Electrical Engineering and Computer Science",
        department: "EECS",
        degree: "MS",
        requirements: {
          gpa: 3.7,
          gre: { verbal: 155, quantitative: 170, writing: 4.5 },
          toefl: 100,
          ielts: 7.0,
          prerequisites: ["Bachelor's in Engineering or CS"],
          applicationDeadline: "December 15, 2024"
        }
      }
    ],
    scholarships: [
      {
        id: "mit-fellowship",
        name: "MIT Presidential Fellowship",
        amount: 43000,
        eligibility: ["Outstanding academic achievement", "Research potential"],
        deadline: "January 1, 2025",
        renewable: true
      }
    ]
  },
  {
    id: "uga",
    name: "University of Georgia",
    location: { city: "Athens", state: "GA" },
    website: "https://www.uga.edu",
    tuition: {
      inState: 12080,
      outOfState: 29844,
      international: 29844
    },
    hasInStateTuitionWaiver: true,
    ranking: 48,
    programs: [
      {
        id: "business-mba",
        name: "Business Administration",
        department: "Terry College of Business",
        degree: "MBA",
        requirements: {
          gpa: 3.0,
          gmat: 550,
          toefl: 80,
          ielts: 6.5,
          prerequisites: ["Work experience preferred"],
          applicationDeadline: "March 1, 2025"
        }
      }
    ],
    scholarships: [
      {
        id: "uga-merit",
        name: "Graduate Merit Scholarship",
        amount: 15000,
        eligibility: ["High GPA", "International students eligible"],
        deadline: "February 1, 2025",
        renewable: true
      }
    ]
  },
  {
    id: "utexas",
    name: "University of Texas at Austin",
    location: { city: "Austin", state: "TX" },
    website: "https://www.utexas.edu",
    tuition: {
      inState: 11698,
      outOfState: 39322,
      international: 39322
    },
    hasInStateTuitionWaiver: true,
    ranking: 38,
    programs: [
      {
        id: "engineering-ms",
        name: "Mechanical Engineering",
        department: "Cockrell School of Engineering",
        degree: "MS",
        requirements: {
          gpa: 3.0,
          gre: { verbal: 150, quantitative: 160, writing: 3.5 },
          toefl: 79,
          ielts: 6.5,
          prerequisites: ["Bachelor's in Engineering"],
          applicationDeadline: "December 1, 2024"
        }
      }
    ],
    scholarships: [
      {
        id: "longhorn-scholarship",
        name: "Longhorn Graduate Scholarship",
        amount: 20000,
        eligibility: ["Merit-based", "Research assistantship"],
        deadline: "January 15, 2025",
        renewable: true
      }
    ]
  },
  {
    id: "asu",
    name: "Arizona State University",
    location: { city: "Tempe", state: "AZ" },
    website: "https://www.asu.edu",
    tuition: {
      inState: 12691,
      outOfState: 29428,
      international: 29428
    },
    hasInStateTuitionWaiver: true,
    ranking: 103,
    programs: [
      {
        id: "data-science-ms",
        name: "Data Science",
        department: "School of Computing and Augmented Intelligence",
        degree: "MS",
        requirements: {
          gpa: 3.0,
          gre: { verbal: 146, quantitative: 155, writing: 3.0 },
          toefl: 80,
          ielts: 6.5,
          prerequisites: ["Programming background", "Statistics knowledge"],
          applicationDeadline: "January 15, 2025"
        }
      }
    ],
    scholarships: [
      {
        id: "asu-graduate",
        name: "Graduate College Fellowship",
        amount: 25000,
        eligibility: ["High academic achievement", "Research focus"],
        deadline: "January 1, 2025",
        renewable: true
      }
    ]
  },
  {
    id: "purdue",
    name: "Purdue University",
    location: { city: "West Lafayette", state: "IN" },
    website: "https://www.purdue.edu",
    tuition: {
      inState: 10002,
      outOfState: 28794,
      international: 28794
    },
    hasInStateTuitionWaiver: true,
    ranking: 51,
    programs: [
      {
        id: "aerospace-ms",
        name: "Aeronautical and Astronautical Engineering",
        department: "School of Aeronautics and Astronautics",
        degree: "MS",
        requirements: {
          gpa: 3.25,
          gre: { verbal: 153, quantitative: 155, writing: 3.5 },
          toefl: 88,
          ielts: 6.5,
          prerequisites: ["Bachelor's in Aerospace Engineering or related"],
          applicationDeadline: "December 15, 2024"
        }
      }
    ],
    scholarships: [
      {
        id: "purdue-ta",
        name: "Teaching Assistantship",
        amount: 22000,
        eligibility: ["Graduate students", "Teaching capability"],
        deadline: "February 1, 2025",
        renewable: true
      }
    ]
  }
]