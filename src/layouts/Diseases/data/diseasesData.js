const diseasesData = {
  categories: [
    {
      name: "Allergies",
      icon: "allergies",
      items: [
        {
          name: "Peanut Allergy",
          diagnosisDate: "03/15/2020",
          severity: "Moderate",
          description: "Type I hypersensitivity reaction to peanuts",
          treatment: "Strict avoidance, Epinephrine auto-injector 0.3mg as needed"
        },
        {
          name: "Seasonal Allergic Rhinitis",
          diagnosisDate: "05/22/2018",
          severity: "Mild",
          description: "Hypersensitivity to tree and grass pollens",
          treatment: "Cetirizine 10mg daily during pollen season"
        }
      ]
    },
    {
      name: "Chronic Conditions",
      icon: "monitor_heart",
      items: [
        {
          name: "Type 2 Diabetes",
          diagnosisDate: "01/10/2019",
          severity: "Controlled",
          description: "Insulin-resistant diabetes mellitus",
          treatment: "Metformin 850mg twice daily, HbA1c monitoring every 3 months"
        },
        {
          name: "Essential Hypertension",
          diagnosisDate: "07/05/2017",
          severity: "Stage 1",
          description: "Primary hypertension without end-organ damage",
          treatment: "Amlodipine 5mg daily, lifestyle modifications"
        }
      ]
    },
    {
      name: "Infectious Diseases",
      icon: "coronavirus",
      items: [
        {
          name: "COVID-19",
          diagnosisDate: "03/12/2022",
          severity: "Moderate",
          description: "SARS-CoV-2 infection confirmed by PCR",
          treatment: "Symptomatic management, self-isolation for 10 days"
        }
      ]
    }
  ]
};

export default diseasesData;