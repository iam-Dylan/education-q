# EducationQ Config Files

Files in this folder:
- `config_template.yaml`: official full template.
- `config_teacher0shot_gpqa_diamond.yaml`: official GPQA Diamond config.
- `config_teacher0shot_mmlupro_stratified.yaml`: official MMLU-Pro Stratified config.
- `educationq_benchmark.yaml`: local sample config with paths adjusted for this workspace.

For GPQA Diamond, set:

```yaml
DATASET_TYPE: "gpqa"
DATASET_NAME: "gpqa_diamond.csv"
```

For MMLU-Pro Stratified, set:

```yaml
DATASET_TYPE: "mmlu-pro"
DATASET_NAME: "mmlu_pro_stratified.json"
```
