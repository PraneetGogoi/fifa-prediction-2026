# %%
import pandas as pd
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.gridspec as gridspec
from matplotlib.colors import LinearSegmentedColormap
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import plotly.figure_factory as ff
import warnings, os

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (accuracy_score, roc_auc_score, classification_report,
                              confusion_matrix, roc_curve, precision_recall_curve)
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.inspection import permutation_importance
import xgboost as xgb
import lightgbm as lgb

warnings.filterwarnings('ignore')
pd.set_option('display.max_columns', None)

# Matplotlib theme
plt.rcParams.update({
    'figure.facecolor': '#0d0d1a',
    'axes.facecolor': '#111122',
    'axes.edgecolor': '#2a2a4a',
    'text.color': '#e8e8f0',
    'axes.labelcolor': '#c8c8e0',
    'xtick.color': '#a8a8c8',
    'ytick.color': '#a8a8c8',
    'grid.color': '#1e1e3a',
    'grid.alpha': 0.6,
    'axes.grid': True,
    'font.family': 'DejaVu Sans',
    'axes.titlepad': 12,
    'axes.labelpad': 8,
})

# Color palette
GOLD   = '#FFD700'
SILVER = '#C0C0C0'
BLUE   = '#1e90ff'
GREEN  = '#00e676'
RED    = '#ff4444'
PURPLE = '#9c27b0'

print(f"   XGBoost {xgb.__version__}  |  LightGBM {lgb.__version__}  |  Pandas {pd.__version__}")

# %%
TRAIN_PATH = "train.csv"
TEST_PATH  = "test.csv"
SUB_PATH   = "submission.csv"

train = pd.read_csv(TRAIN_PATH)
test  = pd.read_csv(TEST_PATH)
sub   = pd.read_csv(SUB_PATH)

print(f"Train : {train.shape[0]:,} rows × {train.shape[1]} cols")
print(f"Test  : {test.shape[0]:,} rows × {test.shape[1]} cols")
print(f"Submit: {sub.shape[0]:,} rows × {sub.shape[1]} cols")
print("\nColumns:", list(train.columns))
print("\nWinner distribution:\n", train['winner'].value_counts())
train.head(5)

# %%
# ## 3  🔍 Exploratory Data Analysis & Cleaning

# %%

print(" DATA TYPES ")
print(train.dtypes)
print("\n MISSING VALUES ")
print(train.isnull().sum())
print("\n BASIC STATS (numeric) ")
train.describe().T

# %%

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#0d0d1a')

labels = ['Not Winner', 'Winner']
sizes  = train['winner'].value_counts().values
colors = [RED, GOLD]
wedges, texts, autotexts = axes[0].pie(
    sizes, labels=labels, autopct='%1.1f%%', colors=colors,
    startangle=90, textprops={'color': 'white', 'fontsize': 13},
    wedgeprops={'edgecolor': '#0d0d1a', 'linewidth': 2})
for at in autotexts:
    at.set_fontsize(13); at.set_color('white')
axes[0].set_title('Class Distribution', color=GOLD, fontsize=15, fontweight='bold')

counts = train['winner'].value_counts()
bars = axes[1].bar(labels, counts.values, color=colors, edgecolor='#0d0d1a', linewidth=1.5, width=0.5)
for bar, val in zip(bars, counts.values):
    axes[1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
                 str(val), ha='center', va='bottom', color='white', fontsize=13, fontweight='bold')
axes[1].set_title('Winner Count', color=GOLD, fontsize=15, fontweight='bold')
axes[1].set_ylabel('Count', color='#c8c8e0')

plt.suptitle('🏆  Target Variable: Winner Distribution', color=GOLD, fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('plot_01_class_distribution.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()
print(" Saved plot_01_class_distribution.png")

# %%
conf_win = train.groupby('confederation')['winner'].agg(['sum','count']).reset_index()
conf_win.columns = ['confederation', 'winners', 'total']
conf_win['win_rate'] = conf_win['winners'] / conf_win['total']
conf_win = conf_win.sort_values('win_rate', ascending=False)

fig, axes = plt.subplots(1, 2, figsize=(16, 6))
fig.patch.set_facecolor('#0d0d1a')

bar_colors = plt.cm.plasma(np.linspace(0.2, 0.9, len(conf_win)))
axes[0].barh(conf_win['confederation'], conf_win['win_rate'],
             color=bar_colors, edgecolor='#0d0d1a', linewidth=1)
axes[0].set_xlabel('Win Rate', color='#c8c8e0')
axes[0].set_title('Win Rate by Confederation', color=GOLD, fontsize=14, fontweight='bold')
for i, (val, name) in enumerate(zip(conf_win['win_rate'], conf_win['confederation'])):
    axes[0].text(val + 0.005, i, f'{val:.1%}', va='center', color='white', fontsize=11)

axes[1].barh(conf_win['confederation'], conf_win['winners'],
             color=bar_colors, edgecolor='#0d0d1a', linewidth=1)
axes[1].set_xlabel('Total Winners', color='#c8c8e0')
axes[1].set_title('Total Winners by Confederation', color=GOLD, fontsize=14, fontweight='bold')

plt.suptitle('Confederation Analytics', color=GOLD, fontsize=16, fontweight='bold')
plt.tight_layout()
plt.savefig('plot_02_confederation.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%

num_features = ['fifa_points','win_rate_last_year','goals_scored_avg',
                'avg_player_rating','market_value_million_eur','recent_form_score',
                'shots_per_game','possession_avg','passing_accuracy','clean_sheets_last_10']

fig, axes = plt.subplots(2, 5, figsize=(22, 9))
fig.patch.set_facecolor('#0d0d1a')
axes = axes.flatten()

winners     = train[train['winner'] == 1]
non_winners = train[train['winner'] == 0]

for i, feat in enumerate(num_features):
    ax = axes[i]
    ax.hist(non_winners[feat], bins=25, alpha=0.7, color=RED,   label='Not Winner', density=True)
    ax.hist(winners[feat],     bins=25, alpha=0.7, color=GOLD,  label='Winner',     density=True)
    ax.set_title(feat.replace('_',' ').title(), color='#e8e8f0', fontsize=10, fontweight='bold')
    ax.legend(fontsize=8)

plt.suptitle('Feature Distributions: Winners vs Non-Winners',
             color=GOLD, fontsize=16, fontweight='bold', y=1.01)
plt.tight_layout()
plt.savefig('plot_03_feature_distributions.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%

num_cols = train.select_dtypes(include=np.number).columns.tolist()
corr     = train[num_cols].corr()

fig, ax = plt.subplots(figsize=(18, 14))
fig.patch.set_facecolor('#0d0d1a')
ax.set_facecolor('#111122')

cmap = LinearSegmentedColormap.from_list('custom',
       ['#ff4444','#111122','#1e90ff'], N=256)
mask = np.zeros_like(corr, dtype=bool)
mask[np.triu_indices_from(mask)] = True

sns.heatmap(corr, mask=mask, cmap=cmap, vmin=-1, vmax=1, center=0,
            ax=ax, annot=True, fmt='.2f', annot_kws={'size': 8, 'color': 'white'},
            linewidths=0.5, linecolor='#0d0d1a',
            cbar_kws={'shrink': 0.8, 'label': 'Correlation'})

ax.set_title('Feature Correlation Matrix', color=GOLD, fontsize=17, fontweight='bold', pad=15)
plt.tight_layout()
plt.savefig('plot_04_correlation.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%

key_features = ['fifa_points','avg_player_rating','market_value_million_eur',
                'recent_form_score','win_rate_last_year','goals_scored_avg']

fig, axes = plt.subplots(2, 3, figsize=(18, 10))
fig.patch.set_facecolor('#0d0d1a')
axes = axes.flatten()

for i, feat in enumerate(key_features):
    ax = axes[i]
    data_w  = winners[feat].dropna()
    data_nw = non_winners[feat].dropna()
    bp = ax.boxplot([data_nw, data_w], patch_artist=True, widths=0.5,
                    medianprops=dict(color='white', linewidth=2),
                    whiskerprops=dict(color='#c8c8e0'),
                    capprops=dict(color='#c8c8e0'),
                    flierprops=dict(marker='o', color='gray', alpha=0.4, markersize=4))
    bp['boxes'][0].set_facecolor(RED + '88')
    bp['boxes'][1].set_facecolor(GOLD + '88')
    ax.set_xticks([1, 2], ['Not Winner', 'Winner'])
    ax.set_title(feat.replace('_',' ').title(), color='#e8e8f0', fontsize=11, fontweight='bold')
plt.suptitle('Key Metrics Distribution by Outcome',
             color=GOLD, fontsize=16, fontweight='bold', y=1.01)
plt.tight_layout()
plt.savefig('plot_05_boxplots.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%

team_win = train.groupby('team_name')['winner'].agg(['mean','sum','count']).reset_index()
team_win.columns = ['team_name','win_rate','wins','matches']
team_win = team_win[team_win['matches'] >= 5].sort_values('win_rate', ascending=False).head(20)
fig, ax = plt.subplots(figsize=(16, 8))
fig.patch.set_facecolor('#0d0d1a')
ax.set_facecolor('#111122')
colors_bar = [GOLD if i < 3 else (SILVER if i < 5 else BLUE) for i in range(len(team_win))]
bars = ax.bar(team_win['team_name'], team_win['win_rate'],
              color=colors_bar, edgecolor='#0d0d1a', linewidth=1.2)
for bar, val in zip(bars, team_win['win_rate']):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.008,
            f'{val:.0%}', ha='center', va='bottom', color='white', fontsize=9, fontweight='bold')

ax.set_xticklabels(team_win['team_name'], rotation=45, ha='right', fontsize=9)
ax.set_ylabel('Win Rate', color='#c8c8e0')
ax.set_title('Top 20 Teams by Win Rate (Training Data)',
             color=GOLD, fontsize=16, fontweight='bold')

gold_p   = mpatches.Patch(color=GOLD,   label='Top 3')
silver_p = mpatches.Patch(color=SILVER, label='Top 5')
blue_p   = mpatches.Patch(color=BLUE,   label='Others')
ax.legend(handles=[gold_p, silver_p, blue_p], loc='upper right', fontsize=10)

plt.tight_layout()
plt.savefig('plot_06_top_teams.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%

def engineer_features(df):
    df = df.copy()
    df['strength_index']      = (df['fifa_points'] +
                                  df['recent_form_score'] * 50 +
                                  df['avg_player_rating'] * 10)
    df['goal_efficiency']     = df['goals_scored_avg'] / df['goals_conceded_avg'].clip(lower=0.1)
    df['attack_potency']      = (df['shots_per_game'] *
                                  df['shots_on_target_ratio'] *
                                  df['goals_scored_avg'])
    df['defensive_solidity']  = df['clean_sheets_last_10'] / (df['goals_conceded_avg'] + 0.5)
    df['squad_quality']       = (df['avg_player_rating'] * 0.4 +
                                  (df['market_value_million_eur'] / 1200) * 100 * 0.3 +
                                  (df['experience_avg_caps'] / 65) * 100 * 0.3)
    df['form_consistency']    = df['win_rate_last_year'] * df['recent_form_score']
    df['possession_dominance']= df['possession_avg'] * df['passing_accuracy'] / 100
    df['star_power']          = df['star_players_count'] * df['market_value_million_eur']
    df['contextual_advantage']= (df['host_advantage'] * 10 +
                                  df['climate_similarity_score'] * 5 -
                                  df['travel_distance_avg'] * 0.5)
    df['goals_diff_avg']      = df['goals_scored_avg'] - df['goals_conceded_avg']
    df['consistency_score']   = df['wins_last_10_matches'] - df['losses_last_10_matches']
    df['experience_rank']     = df['experience_avg_caps'] * df['fifa_points'] / 1000
    conf_map = {'UEFA':1,'CONMEBOL':2,'CAF':3,'CONCACAF':4,'AFC':5,'OFC':6}
    df['conf_code']           = df['confederation'].map(conf_map).fillna(0)
    return df
X_all  = engineer_features(train)
X_test = engineer_features(test)

num_feats = [c for c in X_all.columns
             if c not in ['team_name','country_code','confederation','winner']
             and X_all[c].dtype != object]

X = X_all[num_feats].fillna(X_all[num_feats].mean())
y = train['winner']
X_test_fe = X_test[num_feats].fillna(X_test[num_feats].mean())

print(f"Features after engineering: {len(num_feats)}")
print(f"X shape: {X.shape}  |  X_test shape: {X_test_fe.shape}")
print("\nNew features:", [f for f in num_feats if f not in train.columns])

# %%
scaler = StandardScaler()
X_scaled      = pd.DataFrame(scaler.fit_transform(X),      columns=num_feats)
X_test_scaled = pd.DataFrame(scaler.transform(X_test_fe),  columns=num_feats)

X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

X_train_s, X_val_s = X_scaled.iloc[X_train.index], X_scaled.iloc[X_val.index]

print(f"Train: {X_train.shape}  |  Val: {X_val.shape}")
print(f"Class balance — Train: {y_train.value_counts().to_dict()}  |  Val: {y_val.value_counts().to_dict()}")

# %%
print("Training XGBoost...")
xgb_model = xgb.XGBClassifier(
    n_estimators=600, learning_rate=0.04, max_depth=6,
    subsample=0.8, colsample_bytree=0.8,
    reg_alpha=0.1, reg_lambda=1.0,
    min_child_weight=3, gamma=0.1,
    eval_metric='logloss', random_state=42, n_jobs=-1)
xgb_model.fit(X_train, y_train,
              eval_set=[(X_val, y_val)], verbose=False)

print("Training LightGBM...")
lgb_model = lgb.LGBMClassifier(
    n_estimators=600, learning_rate=0.04, max_depth=6,
    num_leaves=40, subsample=0.8, colsample_bytree=0.8,
    reg_alpha=0.1, reg_lambda=1.0,
    random_state=42, n_jobs=-1, verbose=-1)
lgb_model.fit(X_train, y_train,
              eval_set=[(X_val, y_val)])

print("Training Random Forest...")
rf_model = RandomForestClassifier(
    n_estimators=400, max_depth=12,
    min_samples_split=5, min_samples_leaf=2,
    random_state=42, n_jobs=-1)
rf_model.fit(X_train, y_train)
print("Training Gradient Boosting...")
gb_model = GradientBoostingClassifier(
    n_estimators=300, learning_rate=0.05,
    max_depth=5, subsample=0.8, random_state=42)
gb_model.fit(X_train, y_train)

print("\nAll models trained!")

# %%
models = {
    'XGBoost'          : xgb_model,
    'LightGBM'         : lgb_model,
    'Random Forest'    : rf_model,
    'Gradient Boosting': gb_model,
}

results = {}
for name, model in models.items():
    prob = model.predict_proba(X_val)[:,1]
    pred = model.predict(X_val)
    results[name] = {
        'AUC'     : roc_auc_score(y_val, prob),
        'Accuracy': accuracy_score(y_val, pred),
        'proba'   : prob,
        'pred'    : pred,
    }
    print(f"{name:20s}  AUC: {results[name]['AUC']:.4f}  Acc: {results[name]['Accuracy']:.4f}")
ens_proba = (0.35*results['XGBoost']['proba'] +
             0.35*results['LightGBM']['proba'] +
             0.20*results['Random Forest']['proba'] +
             0.10*results['Gradient Boosting']['proba'])
ens_pred  = (ens_proba >= 0.5).astype(int)
ens_auc   = roc_auc_score(y_val, ens_proba)
ens_acc   = accuracy_score(y_val, ens_pred)
results['Ensemble'] = {'AUC':ens_auc,'Accuracy':ens_acc,'proba':ens_proba,'pred':ens_pred}
print(f"{'Ensemble':20s}  AUC: {ens_auc:.4f}  Acc: {ens_acc:.4f}")

# %%
fig, axes = plt.subplots(1, 2, figsize=(18, 7))
fig.patch.set_facecolor('#0d0d1a')

palette = [GOLD, BLUE, GREEN, PURPLE, RED]
for (name, res), col in zip(results.items(), palette):
    fpr, tpr, _ = roc_curve(y_val, res['proba'])
    axes[0].plot(fpr, tpr, label=f"{name} (AUC={res['AUC']:.3f})",
                 color=col, linewidth=2.2)

axes[0].plot([0,1],[0,1],'--',color='gray',alpha=0.5)
axes[0].set_xlabel('False Positive Rate'); axes[0].set_ylabel('True Positive Rate')
axes[0].set_title('ROC Curves — All Models', color=GOLD, fontsize=14, fontweight='bold')
axes[0].legend(fontsize=10)

names   = list(results.keys())
aucs    = [results[n]['AUC']      for n in names]
accs    = [results[n]['Accuracy'] for n in names]
x       = np.arange(len(names)); w=0.35
bars1 = axes[1].bar(x - w/2, aucs, w, label='AUC',      color=GOLD,  alpha=0.85, edgecolor='#0d0d1a')
bars2 = axes[1].bar(x + w/2, accs, w, label='Accuracy', color=BLUE,  alpha=0.85, edgecolor='#0d0d1a')
for bar in list(bars1)+list(bars2):
    h = bar.get_height()
    axes[1].text(bar.get_x()+bar.get_width()/2, h+0.003,
                 f'{h:.3f}', ha='center', va='bottom', color='white', fontsize=9)
axes[1].set_xticks(x); axes[1].set_xticklabels(names, rotation=20, ha='right', fontsize=9)
axes[1].set_ylim(0.5, 1.05)
axes[1].set_title('Model Comparison', color=GOLD, fontsize=14, fontweight='bold')
axes[1].legend(fontsize=11)

plt.tight_layout()
plt.savefig('plot_07_roc_comparison.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%
fig, axes = plt.subplots(2, 3, figsize=(20, 12))
fig.patch.set_facecolor('#0d0d1a')
axes = axes.flatten()

cmap_cm = LinearSegmentedColormap.from_list('cm', ['#111122','#1e90ff','#FFD700'])

for i, (name, res) in enumerate(results.items()):
    cm = confusion_matrix(y_val, res['pred'])
    sns.heatmap(cm, annot=True, fmt='d', cmap=cmap_cm,
                ax=axes[i], annot_kws={'size': 18, 'color': 'white'},
                xticklabels=['Not Win','Win'],
                yticklabels=['Not Win','Win'])
    axes[i].set_title(f'{name}\nAUC={res["AUC"]:.3f}',
                      color=GOLD, fontsize=13, fontweight='bold')
    axes[i].tick_params(colors='#c8c8e0')
axes[-1].set_visible(False)  
plt.suptitle('Confusion Matrices', color=GOLD, fontsize=18, fontweight='bold')
plt.tight_layout()
plt.savefig('plot_08_confusion_matrices.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%
fig, ax = plt.subplots(figsize=(12, 7))
fig.patch.set_facecolor('#0d0d1a')

for (name, res), col in zip(results.items(), palette):
    prec, rec, _ = precision_recall_curve(y_val, res['proba'])
    ax.plot(rec, prec, label=name, color=col, linewidth=2)
ax.set_xlabel('Recall');  ax.set_ylabel('Precision')
ax.set_title('Precision-Recall Curves', color=GOLD, fontsize=15, fontweight='bold')
ax.legend(fontsize=11)
plt.tight_layout()
plt.savefig('plot_09_precision_recall.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%
imp_xgb = pd.DataFrame({
    'feature'   : num_feats,
    'importance': xgb_model.feature_importances_
}).sort_values('importance', ascending=False).head(20)

imp_lgb = pd.DataFrame({
    'feature'   : num_feats,
    'importance': lgb_model.feature_importances_
}).sort_values('importance', ascending=False).head(20)

fig, axes = plt.subplots(1, 2, figsize=(22, 9))
fig.patch.set_facecolor('#0d0d1a')

for ax, df, title in zip(axes, [imp_xgb, imp_lgb], ['XGBoost', 'LightGBM']):
    colors_f = plt.cm.plasma(np.linspace(0.2, 0.9, len(df)))
    ax.barh(df['feature'][::-1], df['importance'][::-1],
            color=colors_f, edgecolor='#0d0d1a', linewidth=0.8)
    ax.set_title(f'Top 20 Features — {title}', color=GOLD, fontsize=13, fontweight='bold')
    ax.set_xlabel('Importance')
    for i, (val, feat) in enumerate(zip(df['importance'][::-1], df['feature'][::-1])):
        ax.text(val + 0.001, i, f'{val:.3f}', va='center', color='white', fontsize=8)

plt.suptitle('Feature Importance', color=GOLD, fontsize=17, fontweight='bold')
plt.tight_layout()
plt.savefig('plot_10_feature_importance.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_results = {}

for name, model in {'XGBoost':xgb_model,'LightGBM':lgb_model,'RF':rf_model}.items():
    scores = cross_val_score(model, X, y, cv=skf, scoring='roc_auc', n_jobs=-1)
    cv_results[name] = scores
    print(f"{name:12s}  CV AUC: {scores.mean():.4f} ± {scores.std():.4f}  |  Folds: {np.round(scores,4)}")

fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor('#0d0d1a')
ax.set_facecolor('#111122')

for i, (name, scores) in enumerate(cv_results.items()):
    ax.plot(range(1,6), scores, 'o-', label=name, linewidth=2.2, markersize=8)
    ax.axhline(scores.mean(), linestyle='--', alpha=0.5)

ax.set_xlabel('Fold'); ax.set_ylabel('AUC-ROC')
ax.set_xticks(range(1,6))
ax.set_title('5-Fold Cross-Validation AUC', color=GOLD, fontsize=15, fontweight='bold')
ax.legend(fontsize=12)
plt.tight_layout()
plt.savefig('plot_11_cross_validation.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%

cal_xgb = CalibratedClassifierCV(xgb_model, cv=3, method='isotonic')
cal_xgb.fit(X_train, y_train)

cal_proba = cal_xgb.predict_proba(X_val)[:,1]
print(f"Calibrated XGB AUC: {roc_auc_score(y_val, cal_proba):.4f}")
from sklearn.calibration import calibration_curve
fig, ax = plt.subplots(figsize=(10, 7))
fig.patch.set_facecolor('#0d0d1a')

for name, prob, col in [('Raw XGB', results['XGBoost']['proba'], RED),
                         ('Calibrated XGB', cal_proba, GOLD),
                         ('Ensemble', ens_proba, GREEN)]:
    frac_pos, mean_pred = calibration_curve(y_val, prob, n_bins=10)
    ax.plot(mean_pred, frac_pos, 's-', label=name, color=col, linewidth=2, markersize=7)
ax.plot([0,1],[0,1],'k--',color='gray', label='Perfect calibration')
ax.set_xlabel('Mean Predicted Probability'); ax.set_ylabel('Fraction of Positives')
ax.set_title('Calibration (Reliability Diagram)', color=GOLD, fontsize=14, fontweight='bold')
ax.legend(fontsize=11)
plt.tight_layout()
plt.savefig('plot_12_calibration.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%
final_xgb = xgb.XGBClassifier(
    n_estimators=600, learning_rate=0.04, max_depth=6,
    subsample=0.8, colsample_bytree=0.8, reg_alpha=0.1, reg_lambda=1.0,
    min_child_weight=3, gamma=0.1, eval_metric='logloss',
    random_state=42, n_jobs=-1)
final_xgb.fit(X, y)

final_lgb = lgb.LGBMClassifier(
    n_estimators=600, learning_rate=0.04, max_depth=6,
    num_leaves=40, subsample=0.8, colsample_bytree=0.8,
    reg_alpha=0.1, reg_lambda=1.0, random_state=42, n_jobs=-1, verbose=-1)
final_lgb.fit(X, y)

final_rf = RandomForestClassifier(
    n_estimators=400, max_depth=12, min_samples_split=5,
    min_samples_leaf=2, random_state=42, n_jobs=-1)
final_rf.fit(X, y)
test_p_xgb = final_xgb.predict_proba(X_test_fe)[:,1]
test_p_lgb = final_lgb.predict_proba(X_test_fe)[:,1]
test_p_rf  = final_rf.predict_proba(X_test_fe)[:,1]
test_proba = 0.40*test_p_xgb + 0.40*test_p_lgb + 0.20*test_p_rf

pred_df = test.copy()
pred_df['win_prob_xgb']      = test_p_xgb
pred_df['win_prob_lgb']      = test_p_lgb
pred_df['win_prob_rf']       = test_p_rf
pred_df['win_prob_ensemble'] = test_proba
pred_df['rank']              = pred_df['win_prob_ensemble'].rank(ascending=False).astype(int)
pred_df = pred_df.sort_values('win_prob_ensemble', ascending=False)

print("Predictions generated!")
print(f"\nTop 10 predicted winners:")
print(pred_df[['team_name','confederation','win_prob_ensemble','rank']].head(10).to_string(index=False))

# %%
top20 = pred_df.head(20).sort_values('win_prob_ensemble')
fig, ax = plt.subplots(figsize=(16, 10))
fig.patch.set_facecolor('#0d0d1a'); ax.set_facecolor('#111122')
bar_c = [GOLD if i >= 17 else (SILVER if i >= 15 else (GREEN if i >= 12 else BLUE))
         for i in range(len(top20))]
bars = ax.barh(top20['team_name'], top20['win_prob_ensemble'],
               color=bar_c, edgecolor='#0d0d1a', linewidth=1.2, height=0.7)

for bar, val in zip(bars, top20['win_prob_ensemble']):
    ax.text(val + 0.005, bar.get_y()+bar.get_height()/2,
            f'{val:.1%}', va='center', color='white', fontsize=10, fontweight='bold')

ax.set_xlabel('Win Probability (Ensemble)', fontsize=12)
ax.set_title('FIFA World Cup 2026 — Top 20 Predicted Winners',
             color=GOLD, fontsize=17, fontweight='bold', pad=15)

patches = [mpatches.Patch(color=GOLD,  label='Top 3 Favorites'),
           mpatches.Patch(color=SILVER,label='Strong Contenders'),
           mpatches.Patch(color=GREEN, label='Dark Horses'),
           mpatches.Patch(color=BLUE,  label='Others')]
ax.legend(handles=patches, fontsize=10, loc='lower right')
ax.set_xlim(0, top20['win_prob_ensemble'].max() * 1.15)

plt.tight_layout()
plt.savefig('plot_13_predictions_bar.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%
fig, axes = plt.subplots(1, 3, figsize=(21, 7))
fig.patch.set_facecolor('#0d0d1a')

pairs = [('win_prob_xgb','win_prob_lgb','XGB vs LGB'),
         ('win_prob_xgb','win_prob_rf', 'XGB vs RF'),
         ('win_prob_lgb','win_prob_rf', 'LGB vs RF')]

for ax, (x_col, y_col, title) in zip(axes, pairs):
    sc = ax.scatter(pred_df[x_col], pred_df[y_col],
                    c=pred_df['win_prob_ensemble'], cmap='plasma',
                    s=80, alpha=0.85, edgecolors='#0d0d1a', linewidths=0.5)
    ax.plot([0,1],[0,1],'--', color='gray', alpha=0.5)
    ax.set_xlabel(x_col.replace('win_prob_','').upper(), fontsize=11)
    ax.set_ylabel(y_col.replace('win_prob_','').upper(), fontsize=11)
    ax.set_title(title, color=GOLD, fontsize=13, fontweight='bold')
    for _, row in pred_df.head(5).iterrows():
        ax.annotate(row['team_name'], (row[x_col], row[y_col]),
                    textcoords='offset points', xytext=(5,5),
                    fontsize=7, color='white', alpha=0.9)
    plt.colorbar(sc, ax=ax, label='Ensemble Prob')

plt.suptitle('Model Agreement Scatter', color=GOLD, fontsize=16, fontweight='bold')
plt.tight_layout()
plt.savefig('plot_14_model_agreement.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%
conf_pred = pred_df.groupby('confederation').agg(
    avg_prob=('win_prob_ensemble','mean'),
    max_prob=('win_prob_ensemble','max'),
    team_count=('team_name','count')
).reset_index().sort_values('avg_prob', ascending=False)

fig, axes = plt.subplots(1, 3, figsize=(21, 7))
fig.patch.set_facecolor('#0d0d1a')

c_colors = plt.cm.tab10(np.linspace(0, 1, len(conf_pred)))

axes[0].bar(conf_pred['confederation'], conf_pred['avg_prob'], color=c_colors, edgecolor='#0d0d1a')
axes[0].set_title('Avg Win Prob by Confederation', color=GOLD, fontsize=13, fontweight='bold')
axes[0].set_xticklabels(conf_pred['confederation'], rotation=30, ha='right')

axes[1].bar(conf_pred['confederation'], conf_pred['max_prob'], color=c_colors, edgecolor='#0d0d1a')
axes[1].set_title('Best Team Prob by Confederation', color=GOLD, fontsize=13, fontweight='bold')
axes[1].set_xticklabels(conf_pred['confederation'], rotation=30, ha='right')
axes[2].bar(conf_pred['confederation'], conf_pred['team_count'], color=c_colors, edgecolor='#0d0d1a')
axes[2].set_title('Teams per Confederation (Test Set)', color=GOLD, fontsize=13, fontweight='bold')
axes[2].set_xticklabels(conf_pred['confederation'], rotation=30, ha='right')

plt.suptitle('Confederation Prediction Breakdown', color=GOLD, fontsize=16, fontweight='bold')
plt.tight_layout()
plt.savefig('plot_15_confederation_pred.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%
pred_df['uncertainty'] = pred_df[['win_prob_xgb','win_prob_lgb','win_prob_rf']].std(axis=1)
top_unc = pred_df.sort_values('win_prob_ensemble', ascending=False).head(20)
fig, ax = plt.subplots(figsize=(16, 8))
fig.patch.set_facecolor('#0d0d1a'); ax.set_facecolor('#111122')
ax.bar(top_unc['team_name'], top_unc['win_prob_ensemble'],
       color=BLUE, alpha=0.7, label='Ensemble Prob', edgecolor='#0d0d1a')
ax.errorbar(top_unc['team_name'], top_unc['win_prob_ensemble'],
            yerr=top_unc['uncertainty'], fmt='none', color=RED,
            capsize=6, capthick=2, linewidth=2, label='±1 Std Dev')
ax.set_xticklabels(top_unc['team_name'], rotation=45, ha='right', fontsize=9)
ax.set_ylabel('Win Probability', fontsize=12)
ax.set_title('Prediction with Uncertainty Bands (Top 20)', color=GOLD, fontsize=14, fontweight='bold')
ax.legend(fontsize=11)
plt.tight_layout()
plt.savefig('plot_16_uncertainty.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()

# %%
top20_plot = pred_df.head(20).sort_values('win_prob_ensemble', ascending=True)
fig = px.bar(
    top20_plot, x='win_prob_ensemble', y='team_name',
    orientation='h', color='win_prob_ensemble',
    color_continuous_scale='plasma',
    text=top20_plot['win_prob_ensemble'].map(lambda x: f'{x:.1%}'),
    hover_data=['confederation','fifa_points','avg_player_rating','market_value_million_eur'],
    title='FIFA World Cup 2026 — Top 20 Win Probabilities (Interactive)',
    labels={'win_prob_ensemble':'Win Probability','team_name':'Team'},
    height=620,
)
fig.update_traces(textposition='outside', textfont_size=11)
fig.update_layout(
    plot_bgcolor='#111122', paper_bgcolor='#0d0d1a',
    font_color='#e8e8f0',
    title_font_color='#FFD700', title_font_size=17,
    coloraxis_showscale=True,
)
fig.show()

# %%

fig = px.scatter(
    pred_df,
    x='market_value_million_eur', y='win_prob_ensemble',
    color='confederation', size='avg_player_rating',
    hover_name='team_name',
    hover_data=['fifa_points','recent_form_score','win_prob_xgb','win_prob_lgb'],
    title='Market Value vs Win Probability (by Confederation)',
    labels={'market_value_million_eur':'Market Value (€M)','win_prob_ensemble':'Win Probability'},
    height=600, color_discrete_sequence=px.colors.qualitative.Bold,
)
fig.update_layout(
    plot_bgcolor='#111122', paper_bgcolor='#0d0d1a',
    font_color='#e8e8f0', title_font_color='#FFD700', title_font_size=15)
fig.show()

# %%
fig = px.sunburst(
    pred_df, path=['confederation','team_name'],
    values='win_prob_ensemble', color='win_prob_ensemble',
    color_continuous_scale='plasma',
    title='Win Probability Sunburst — Confederation → Team',
    height=650,
)
fig.update_layout(
    paper_bgcolor='#0d0d1a', font_color='#e8e8f0',
    title_font_color='#FFD700', title_font_size=15)
fig.show()

# %%
top5 = pred_df.head(5)
radar_cols = ['fifa_points','avg_player_rating','win_rate_last_year',
              'goals_scored_avg','possession_avg','recent_form_score']
labels = ['FIFA Pts','Rating','Win Rate','Goals','Possession','Form']

fig = go.Figure()
for _, row in top5.iterrows():
    vals = [(row[c] - pred_df[c].min()) /
            (pred_df[c].max() - pred_df[c].min()) for c in radar_cols]
    vals += [vals[0]]  
    fig.add_trace(go.Scatterpolar(r=vals, theta=labels+[labels[0]],
                                  fill='toself', name=row['team_name'],
                                  opacity=0.75, line_width=2))

fig.update_layout(
    polar=dict(radialaxis=dict(visible=True, range=[0,1],
                               gridcolor='#2a2a4a', tickcolor='white'),
               angularaxis=dict(tickcolor='white', gridcolor='#2a2a4a'),
               bgcolor='#111122'),
    paper_bgcolor='#0d0d1a', font_color='#e8e8f0',
    title=dict(text='Top 5 Teams — Radar Profile', font_color='#FFD700', font_size=16),
    height=580,
)
fig.show()

# %%
top15 = pred_df.head(15)
hm_features = ['fifa_points','avg_player_rating','market_value_million_eur',
                'win_rate_last_year','goals_scored_avg','recent_form_score',
                'shots_per_game','possession_avg','passing_accuracy',
                'clean_sheets_last_10','experience_avg_caps']
hm_data = top15[hm_features].copy()
hm_norm  = (hm_data - hm_data.min()) / (hm_data.max() - hm_data.min())
fig = go.Figure(data=go.Heatmap(
    z=hm_norm.values,
    x=[f.replace('_',' ').title() for f in hm_features],
    y=top15['team_name'].values,
    colorscale='Plasma', text=np.round(hm_norm.values,2),
    texttemplate='%{text}', textfont_size=9,
    hovertemplate='Team: %{y}<br>Feature: %{x}<br>Norm Value: %{z:.2f}<extra></extra>'
))
fig.update_layout(
    title=dict(text='Feature Heatmap — Top 15 Teams (Normalised)',
               font_color='#FFD700', font_size=15),
    paper_bgcolor='#0d0d1a', plot_bgcolor='#111122',
    font_color='#e8e8f0', height=520,
    xaxis=dict(tickangle=-35),
)
fig.show()

# %%
model_names = ['XGBoost','LightGBM','Random Forest','Gradient Boosting','Ensemble']
model_aucs  = [results[n]['AUC'] for n in model_names]
model_accs  = [results[n]['Accuracy'] for n in model_names]

fig = make_subplots(rows=1, cols=2,
                    subplot_titles=['AUC-ROC Score','Accuracy Score'])

fig.add_trace(go.Bar(name='AUC', x=model_names, y=model_aucs,
                     marker_color='#FFD700', text=[f'{v:.3f}' for v in model_aucs],
                     textposition='outside'), row=1, col=1)
fig.add_trace(go.Bar(name='Accuracy', x=model_names, y=model_accs,
                     marker_color='#1e90ff', text=[f'{v:.3f}' for v in model_accs],
                     textposition='outside'), row=1, col=2)

fig.update_layout(
    title=dict(text='Model Leaderboard', font_color='#FFD700', font_size=16),
    paper_bgcolor='#0d0d1a', plot_bgcolor='#111122', font_color='#e8e8f0',
    height=500, showlegend=False,
)
fig.update_yaxes(range=[0.5,1.05])
fig.show()

# %%
fig = px.scatter(
    pred_df,
    x='fifa_points', y='win_prob_ensemble',
    color='confederation', size='market_value_million_eur',
    size_max=45, hover_name='team_name',
    hover_data={'win_prob_xgb':True,'win_prob_lgb':True,'recent_form_score':True},
    text='team_name',
    title='FIFA Points vs Win Probability (Bubble = Market Value)',
    height=650, color_discrete_sequence=px.colors.qualitative.Vivid,
)
fig.update_traces(textposition='top center', textfont_size=8)
fig.update_layout(
    plot_bgcolor='#111122', paper_bgcolor='#0d0d1a',
    font_color='#e8e8f0', title_font_color='#FFD700', title_font_size=15)
fig.show()

# %%

submission = pd.DataFrame({
    'id'                : range(len(test_proba)),
    'winner_probability': test_proba
})
submission.to_csv('submission_final.csv', index=False)

print("Submission saved: submission_final.csv")
print(f"Shape: {submission.shape}")
print("\nPreview:")
print(submission.head(10))
print("\nStats:")
print(submission['winner_probability'].describe())

# %%

pg_schema = '''
-- ============================================================
--  FIFA World Cup 2026 Prediction Dashboard — PostgreSQL DDL
-- ============================================================

-- 1. Teams dimension table
CREATE TABLE teams (
    team_id          SERIAL PRIMARY KEY,
    team_name        VARCHAR(100) NOT NULL UNIQUE,
    country_code     CHAR(3),
    confederation    VARCHAR(20)
);

-- 2. Raw features table (training data)
CREATE TABLE team_features (
    feature_id               SERIAL PRIMARY KEY,
    team_id                  INT REFERENCES teams(team_id) ON DELETE CASCADE,
    split                    VARCHAR(10) DEFAULT 'train',  -- train / test
    fifa_rank                SMALLINT,
    fifa_points              NUMERIC(7,2),
    wins_last_10_matches     SMALLINT,
    losses_last_10_matches   SMALLINT,
    draws_last_10_matches    SMALLINT,
    win_rate_last_year       NUMERIC(5,4),
    goals_scored_avg         NUMERIC(5,3),
    goals_conceded_avg       NUMERIC(5,3),
    clean_sheets_last_10     SMALLINT,
    shots_per_game           NUMERIC(5,2),
    shots_on_target_ratio    NUMERIC(5,4),
    avg_player_rating        NUMERIC(5,2),
    star_players_count       SMALLINT,
    market_value_million_eur NUMERIC(8,2),
    experience_avg_caps      SMALLINT,
    coach_experience_years   SMALLINT,
    recent_form_score        NUMERIC(5,3),
    possession_avg           NUMERIC(5,2),
    passing_accuracy         NUMERIC(5,2),
    host_advantage           SMALLINT,
    travel_distance_avg      NUMERIC(6,2),
    climate_similarity_score NUMERIC(5,4),
    winner                   SMALLINT   -- 1 = winner, 0 = not winner, NULL for test
);

-- 3. Engineered features table
CREATE TABLE engineered_features (
    ef_id                  SERIAL PRIMARY KEY,
    team_id                INT REFERENCES teams(team_id),
    strength_index         NUMERIC(10,4),
    goal_efficiency        NUMERIC(8,4),
    attack_potency         NUMERIC(8,4),
    defensive_solidity     NUMERIC(8,4),
    squad_quality          NUMERIC(8,4),
    form_consistency       NUMERIC(8,4),
    possession_dominance   NUMERIC(8,4),
    star_power             NUMERIC(12,2),
    contextual_advantage   NUMERIC(8,4),
    goals_diff_avg         NUMERIC(6,4),
    consistency_score      SMALLINT,
    experience_rank        NUMERIC(10,4)
);

-- 4. Model predictions table
CREATE TABLE model_predictions (
    pred_id              SERIAL PRIMARY KEY,
    team_id              INT REFERENCES teams(team_id),
    model_name           VARCHAR(50),       -- XGBoost, LightGBM, RF, Ensemble
    win_probability      NUMERIC(8,6),
    created_at           TIMESTAMP DEFAULT NOW()
);

-- 5. Model metadata table
CREATE TABLE model_runs (
    run_id          SERIAL PRIMARY KEY,
    model_name      VARCHAR(50),
    val_auc         NUMERIC(6,4),
    val_accuracy    NUMERIC(6,4),
    cv_auc_mean     NUMERIC(6,4),
    cv_auc_std      NUMERIC(6,4),
    n_estimators    INT,
    hyperparams     JSONB,
    trained_at      TIMESTAMP DEFAULT NOW()
);

-- 6. Indexes for dashboard performance
CREATE INDEX idx_teams_confederation ON teams(confederation);
CREATE INDEX idx_features_team       ON team_features(team_id);
CREATE INDEX idx_predictions_model   ON model_predictions(model_name);
CREATE INDEX idx_predictions_team    ON model_predictions(team_id);

-- ============================================================
-- USEFUL DASHBOARD QUERIES
-- ============================================================

-- Q1: Top 10 predicted winners (ensemble)
-- SELECT t.team_name, t.confederation,
--        mp.win_probability
-- FROM model_predictions mp
-- JOIN teams t ON t.team_id = mp.team_id
-- WHERE mp.model_name = 'Ensemble'
-- ORDER BY mp.win_probability DESC
-- LIMIT 10;

-- Q2: Average win probability by confederation
-- SELECT t.confederation,
--        AVG(mp.win_probability)  AS avg_prob,
--        MAX(mp.win_probability)  AS best_team_prob,
--        COUNT(DISTINCT t.team_id) AS teams
-- FROM model_predictions mp
-- JOIN teams t ON t.team_id = mp.team_id
-- WHERE mp.model_name = 'Ensemble'
-- GROUP BY t.confederation
-- ORDER BY avg_prob DESC;

-- Q3: Model leaderboard
-- SELECT model_name, val_auc, val_accuracy, cv_auc_mean
-- FROM model_runs
-- ORDER BY val_auc DESC;

-- Q4: Correlation of market value with win probability
-- SELECT t.team_name,
--        tf.market_value_million_eur,
--        mp.win_probability
-- FROM model_predictions mp
-- JOIN teams t  ON t.team_id  = mp.team_id
-- JOIN team_features tf ON tf.team_id = mp.team_id
-- WHERE mp.model_name = 'Ensemble' AND tf.split = 'test'
-- ORDER BY mp.win_probability DESC;
'''
print(pg_schema)

with open('wc2026_schema.sql', 'w') as f:
    f.write(pg_schema)
print("\nPostgreSQL schema saved: wc2026_schema.sql")

# %%
def generate_inserts(pred_df):
    lines = [
        "-- Auto-generated INSERT statements for model_predictions",
        "BEGIN;",
        "",
        "-- Insert teams first (dedup via ON CONFLICT)",
    ]
    for _, row in pred_df.iterrows():
        lines.append(
            f"INSERT INTO teams (team_name, country_code, confederation) "
            f"VALUES ('{row.team_name}', '{row.country_code}', '{row.confederation}') "
            f"ON CONFLICT (team_name) DO NOTHING;"
        )
    lines += ["", "-- Insert ensemble predictions"]
    for i, row in pred_df.iterrows():
        lines.append(
            f"INSERT INTO model_predictions (team_id, model_name, win_probability) "
            f"SELECT team_id, 'Ensemble', {row.win_prob_ensemble:.6f} "
            f"FROM teams WHERE team_name = '{row.team_name}';"
        )
    lines += ["", "COMMIT;"]
    return "\n".join(lines)

sql_inserts = generate_inserts(pred_df)
with open('wc2026_inserts.sql', 'w') as f:
    f.write(sql_inserts)
print("INSERT statements saved: wc2026_inserts.sql")
print("Preview (first 20 lines):")
for line in sql_inserts.split('\n')[:20]:
    print(line)

# %%

top5 = pred_df.head(5)
fig = plt.figure(figsize=(24, 18))
fig.patch.set_facecolor('#0d0d1a')
gs  = gridspec.GridSpec(3, 3, figure=fig, hspace=0.45, wspace=0.35)
ax_a = fig.add_subplot(gs[0, :2])
top20s = pred_df.head(20).sort_values('win_prob_ensemble', ascending=True)
colors_a = [GOLD if i >= 17 else (SILVER if i >= 15 else BLUE) for i in range(20)]
ax_a.barh(top20s['team_name'], top20s['win_prob_ensemble'], color=colors_a, height=0.7)
ax_a.set_title('🏆 Top 20 Win Probabilities', color=GOLD, fontsize=13, fontweight='bold')
ax_a.set_xlabel('Ensemble Win Probability')
ax_b = fig.add_subplot(gs[0, 2])
conf_s = (pred_df.groupby('confederation')['win_prob_ensemble']
          .mean().sort_values(ascending=False))
ax_b.barh(conf_s.index[::-1], conf_s.values[::-1],
          color=plt.cm.plasma(np.linspace(0.3,0.9,len(conf_s))), height=0.6)
ax_b.set_title('By Confederation', color=GOLD, fontsize=12, fontweight='bold')
ax_b.set_xlabel('Avg Win Prob')
ax_c = fig.add_subplot(gs[1, 0])
mn = [n for n in model_names]
bars_c = ax_c.bar(mn, model_aucs, color=[GOLD,BLUE,GREEN,PURPLE,RED], edgecolor='#0d0d1a')
ax_c.set_ylim(0.5, 1.02)
ax_c.set_title('Model AUC', color=GOLD, fontsize=12, fontweight='bold')
for bar, v in zip(bars_c, model_aucs):
    ax_c.text(bar.get_x()+bar.get_width()/2, v+0.005, f'{v:.3f}',
              ha='center', color='white', fontsize=8, fontweight='bold')
ax_d = fig.add_subplot(gs[1, 1:])
imp_top10 = imp_xgb.head(10).sort_values('importance')
ax_d.barh(imp_top10['feature'].str.replace('_',' ').str.title(),
          imp_top10['importance'],
          color=plt.cm.magma(np.linspace(0.3,0.9,10)), height=0.65)
ax_d.set_title('Top 10 Features (XGBoost)', color=GOLD, fontsize=12, fontweight='bold')
ax_e = fig.add_subplot(gs[2, 0])
for (name, res), col in zip(list(results.items())[:3], [GOLD,BLUE,GREEN]):
    fpr, tpr, _ = roc_curve(y_val, res['proba'])
    ax_e.plot(fpr, tpr, color=col, lw=1.8, label=f'{name[:3]} {res["AUC"]:.3f}')
ax_e.plot([0,1],[0,1],'--',color='gray',alpha=0.5)
ax_e.set_title('ROC Curves', color=GOLD, fontsize=12, fontweight='bold')
ax_e.legend(fontsize=8)
ax_f = fig.add_subplot(gs[2, 1])
ax_f.hist(pred_df['win_prob_ensemble'], bins=25, color=BLUE, edgecolor='#0d0d1a', alpha=0.85)
ax_f.axvline(pred_df['win_prob_ensemble'].median(), color=GOLD, lw=2, linestyle='--', label='Median')
ax_f.set_title('Prob Distribution (Test)', color=GOLD, fontsize=12, fontweight='bold')
ax_f.legend(fontsize=9)
ax_g = fig.add_subplot(gs[2, 2])
ax_g.axis('off')
ax_g.set_facecolor('#111122')
medals = ['🥇','🥈','🥉','4️⃣','5️⃣']
ax_g.text(0.5, 1.0, 'Top 5 Predictions', transform=ax_g.transAxes,
          ha='center', va='top', color=GOLD, fontsize=13, fontweight='bold')
for j, (_, row) in enumerate(top5.iterrows()):
    ax_g.text(0.05, 0.80 - j*0.17,
              f"{medals[j]} {row['team_name']:<18} {row['win_prob_ensemble']:.1%}",
              transform=ax_g.transAxes, color='white',
              fontsize=11 if j < 3 else 10, fontweight='bold' if j < 3 else 'normal',
              fontfamily='monospace')

plt.suptitle('FIFA WC 2026 — Prediction System Dashboard',
             color=GOLD, fontsize=20, fontweight='bold', y=1.01)

plt.savefig('plot_17_final_dashboard.png', dpi=150, bbox_inches='tight', facecolor='#0d0d1a')
plt.show()
print("Final dashboard saved: plot_17_final_dashboard.png")

