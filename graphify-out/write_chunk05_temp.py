import json, pathlib

data = {
  "nodes": [
    {"id": "denman_case_study_preview", "label": "Denman Case Study Preview Image", "file_type": "image", "source_file": "public/images/case-studies/denman-case-study-preview.webp", "source_location": None, "source_url": None, "captured_at": None, "author": None, "contributor": None},
    {"id": "denman_case_study", "label": "Denman Case Study", "file_type": None, "source_file": "public/images/case-studies/denman-case-study-preview.webp", "source_location": None, "source_url": None, "captured_at": None, "author": None, "contributor": None},
    {"id": "abstract_fluid_art_style", "label": "Abstract Fluid Art Visual Style", "file_type": None, "source_file": "public/images/case-studies/denman-case-study-preview.webp", "source_location": None, "source_url": None, "captured_at": None, "author": None, "contributor": None},
    {"id": "jordan_mittler_portrait", "label": "Jordan Mittler Portrait", "file_type": "image", "source_file": "public/images/case-studies/jordan-mittler.webp", "source_location": None, "source_url": None, "captured_at": None, "author": None, "contributor": None},
    {"id": "jordan_mittler_person", "label": "Jordan Mittler", "file_type": None, "source_file": "public/images/case-studies/jordan-mittler.webp", "source_location": None, "source_url": None, "captured_at": None, "author": None, "contributor": None},
    {"id": "mittler_case_study_preview", "label": "Mittler Case Study Preview Image", "file_type": "image", "source_file": "public/images/case-studies/mittler-case-study-preview.webp", "source_location": None, "source_url": None, "captured_at": None, "author": None, "contributor": None},
    {"id": "mittler_case_study", "label": "Mittler Case Study", "file_type": None, "source_file": "public/images/case-studies/mittler-case-study-preview.webp", "source_location": None, "source_url": None, "captured_at": None, "author": None, "contributor": None},
    {"id": "vineyard_lifestyle_imagery", "label": "Vineyard Pastoral Lifestyle Imagery", "file_type": None, "source_file": "public/images/case-studies/mittler-case-study-preview.webp", "source_location": None, "source_url": None, "captured_at": None, "author": None, "contributor": None},
    {"id": "nature_sustainability_hero", "label": "Nature Sustainability Hero Image", "file_type": "image", "source_file": "public/images/case-studies/nature-sustainability-hero.webp", "source_location": None, "source_url": None, "captured_at": None, "author": None, "contributor": None},
    {"id": "solar_energy_theme", "label": "Solar Energy Renewable Energy Theme", "file_type": None, "source_file": "public/images/case-studies/nature-sustainability-hero.webp", "source_location": None, "source_url": None, "captured_at": None, "author": None, "contributor": None},
    {"id": "sustainability_case_study", "label": "Nature Sustainability Case Study", "file_type": None, "source_file": "public/images/case-studies/nature-sustainability-hero.webp", "source_location": None, "source_url": None, "captured_at": None, "author": None, "contributor": None}
  ],
  "edges": [
    {"source": "denman_case_study_preview", "target": "denman_case_study", "relation": "references", "confidence": "EXTRACTED", "confidence_score": 1.0, "source_file": "public/images/case-studies/denman-case-study-preview.webp", "source_location": None, "weight": 1.0},
    {"source": "denman_case_study_preview", "target": "abstract_fluid_art_style", "relation": "conceptually_related_to", "confidence": "EXTRACTED", "confidence_score": 1.0, "source_file": "public/images/case-studies/denman-case-study-preview.webp", "source_location": None, "weight": 1.0},
    {"source": "abstract_fluid_art_style", "target": "denman_case_study", "relation": "conceptually_related_to", "confidence": "INFERRED", "confidence_score": 0.8, "source_file": "public/images/case-studies/denman-case-study-preview.webp", "source_location": None, "weight": 0.8},
    {"source": "jordan_mittler_portrait", "target": "jordan_mittler_person", "relation": "references", "confidence": "EXTRACTED", "confidence_score": 1.0, "source_file": "public/images/case-studies/jordan-mittler.webp", "source_location": None, "weight": 1.0},
    {"source": "jordan_mittler_portrait", "target": "mittler_case_study", "relation": "references", "confidence": "INFERRED", "confidence_score": 0.9, "source_file": "public/images/case-studies/jordan-mittler.webp", "source_location": None, "weight": 0.9},
    {"source": "jordan_mittler_person", "target": "mittler_case_study", "relation": "references", "confidence": "INFERRED", "confidence_score": 0.9, "source_file": "public/images/case-studies/jordan-mittler.webp", "source_location": None, "weight": 0.9},
    {"source": "mittler_case_study_preview", "target": "mittler_case_study", "relation": "references", "confidence": "EXTRACTED", "confidence_score": 1.0, "source_file": "public/images/case-studies/mittler-case-study-preview.webp", "source_location": None, "weight": 1.0},
    {"source": "mittler_case_study_preview", "target": "vineyard_lifestyle_imagery", "relation": "conceptually_related_to", "confidence": "EXTRACTED", "confidence_score": 1.0, "source_file": "public/images/case-studies/mittler-case-study-preview.webp", "source_location": None, "weight": 1.0},
    {"source": "vineyard_lifestyle_imagery", "target": "mittler_case_study", "relation": "conceptually_related_to", "confidence": "INFERRED", "confidence_score": 0.75, "source_file": "public/images/case-studies/mittler-case-study-preview.webp", "source_location": None, "weight": 0.75},
    {"source": "mittler_case_study_preview", "target": "jordan_mittler_portrait", "relation": "conceptually_related_to", "confidence": "INFERRED", "confidence_score": 0.85, "source_file": "public/images/case-studies/mittler-case-study-preview.webp", "source_location": None, "weight": 0.85},
    {"source": "nature_sustainability_hero", "target": "sustainability_case_study", "relation": "references", "confidence": "EXTRACTED", "confidence_score": 1.0, "source_file": "public/images/case-studies/nature-sustainability-hero.webp", "source_location": None, "weight": 1.0},
    {"source": "nature_sustainability_hero", "target": "solar_energy_theme", "relation": "conceptually_related_to", "confidence": "EXTRACTED", "confidence_score": 1.0, "source_file": "public/images/case-studies/nature-sustainability-hero.webp", "source_location": None, "weight": 1.0},
    {"source": "solar_energy_theme", "target": "sustainability_case_study", "relation": "conceptually_related_to", "confidence": "INFERRED", "confidence_score": 0.9, "source_file": "public/images/case-studies/nature-sustainability-hero.webp", "source_location": None, "weight": 0.9}
  ],
  "hyperedges": [],
  "input_tokens": 0,
  "output_tokens": 0
}

out_path = pathlib.Path("c:/Users/Gabriel/Documents/GitHub/redesign-2026/graphify-out/.graphify_chunk_05.json")
out_path.write_text(json.dumps(data, indent=2))
print("Written:", out_path)
print("Nodes:", len(data["nodes"]), "  Edges:", len(data["edges"]))
