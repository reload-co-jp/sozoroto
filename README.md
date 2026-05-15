# そぞろっと（sozoroto）仕様書

## 1. 概要

### 1.1 サービス名

そぞろっと（sozoroto）

### 1.2 コンセプト

東京近辺の散歩コースを紹介・検索できるWebアプリ。

「目的地に最短で行くための地図」ではなく、「なんとなく歩きたい日に、ちょうどよい道を見つける」ためのサービスとして設計する。

散歩コースだけでなく、その街の歴史、ランドマーク、建築、神社仏閣、文化、地形、商店街などの情報も合わせて紹介し、“街を知りながら歩く” 体験を提供する。

初期段階ではユーザー投稿型SNSではなく、運営側が作成した散歩コースを掲載するメディア型アプリとして開始する。

### 1.3 初期対象エリア

東京23区を中心に、東京近辺の徒歩で楽しめるエリアを対象とする。

初期掲載候補：

- 秋葉原
- 神田
- 御茶ノ水
- 上野
- 浅草
- 日本橋
- 神保町
- 谷中・根津・千駄木
- 清澄白河
- 表参道・青山
- 代官山・中目黒
- 吉祥寺
- 下北沢
- 高円寺
- 横浜・みなとみらい
- 鎌倉
- 川越

## 2. 目的

### 2.1 ユーザー側の目的

ユーザーが以下のような気分や条件に合う散歩コースを探せるようにする。

- 休日に軽く歩きたい
- 仕事の合間に気分転換したい
- 知らない街を歩きたい
- カフェや飲食店に寄りながら歩きたい
- 歴史・建築・自然・商店街などを楽しみたい
- デートや友人との散歩に使いたい
- 観光ほど重くない街歩きをしたい

### 2.2 運営側の目的

- 東京近辺の散歩コースをコンテンツとして蓄積する
- 秋葉原・神田周辺など、自社と関係のある地域情報と連携する
- SEO流入を狙える地域コンテンツを作る
- 将来的に地域メディア、店舗紹介、イベント紹介と接続する
- 投稿型サービスに拡張可能な基盤を作る

## 3. ターゲットユーザー

### 3.1 メインユーザー

- 東京近辺に住んでいる人
- 東京近辺で働いている人
- 休日に街歩きしたい人
- 観光地ではない街の魅力を知りたい人
- カフェ、古い建物、商店街、神社、川沿いなどが好きな人

### 3.2 サブユーザー

- 東京観光のリピーター
- 出張や用事のついでに少し歩きたい人
- コワーキングスペース利用者
- イベント参加前後に周辺を歩きたい人
- 地域メディアの読者

## 4. サービスの方向性

### 4.1 初期方針

初期版では、以下のような「散歩コース紹介メディア」として作る。

- 運営がコースを登録する
- ユーザーはコースを検索・閲覧する
- ログインなしで利用可能
- SEOに強い静的ページを用意する
- 地図と写真を中心に見せる

## 5. MVP要件

### 5.1 MVPで作るもの

初期リリースでは以下に絞る。

1. トップページ
2. コース一覧ページ
3. コース詳細ページ
4. エリア一覧ページ
5. エリア別コース一覧ページ
6. タグ別コース一覧ページ
7. 地図表示
8. コース検索・絞り込み
9. 管理用データ登録方式
10. SEO用メタ情報

## 6. 主要ページ

## 6.1 トップページ

### 目的

サービスの世界観を伝え、ユーザーをコース検索へ誘導する。

### 表示内容

- サービス名
- キャッチコピー
- 検索ボックス
- 人気エリア
- おすすめ散歩コース
- 新着コース
- タグ一覧
- 東京近辺の注目エリア

### キャッチコピー候補

- なんとなく歩きたい日に。
- 東京の散歩コースを、そぞろっと探す。
- 目的地より、歩く時間を楽しむ。
- 知らない道に、少し寄り道。

## 6.2 コース一覧ページ

### URL例

`/courses`

### 表示内容

- コースカード一覧
- 検索フォーム
- エリア絞り込み
- 所要時間絞り込み
- 距離絞り込み
- タグ絞り込み
- 並び替え

### 並び替え

- 新着順
- おすすめ順
- 短い順
- 長い順

## 6.3 コース詳細ページ

### URL例

`/courses/akihabara-kanda-cafe-walk`

### 表示内容

- コース名
- メイン画像
- 歴史・ランドマーク解説
- 概要
- エリア
- 所要時間
- 距離
- 難易度
- 出発地点
- 到着地点
- 経由スポット
- 地図
- ルート説明
- 写真
- タグ
- おすすめ時間帯
- 注意点
- 関連コース

### コース詳細に必要な情報

- 歴史解説
- ランドマーク解説
- 建築・文化情報
- タイトル
- スラッグ
- 説明文
- 短い紹介文
- エリア
- 距離
- 所要時間
- 想定歩数
- 難易度
- 開始地点
- 終了地点
- 経由地
- ルート座標
- 写真
- タグ
- 公開状態
- 公開日
- 更新日

## 6.4 エリア一覧ページ

### URL例

`/areas`

### 表示内容

- エリア一覧
- 各エリアの説明
- 掲載コース数
- 代表画像

## 6.5 エリア詳細ページ

### URL例

`/areas/akihabara`

### 表示内容

- エリア名
- エリア説明
- エリア内のコース一覧
- 関連タグ
- 周辺エリア

## 6.6 タグ別ページ

### URL例

`/tags/cafe`

### 表示内容

- タグ名
- タグ説明
- 該当コース一覧

## 7. コース分類

## 7.1 所要時間

- 15分以内
- 30分以内
- 1時間以内
- 1〜2時間
- 2時間以上

## 7.2 距離

- 1km未満
- 1〜2km
- 2〜4km
- 4〜6km
- 6km以上

## 7.3 難易度

- とても軽い
- 軽い
- 普通
- しっかり歩く

### 判定基準

距離、坂道、階段、混雑、歩道の広さを元に運営が設定する。

## 7.4 シーン

- 仕事前
- 仕事帰り
- 昼休み
- 休日
- デート
- 友人と
- 一人散歩
- 観光ついで
- 雨の日
- 夜散歩

## 7.5 テーマタグ

- カフェ
- 喫茶店
- 商店街
- 神社
- 寺
- 川沿い
- 公園
- 建築
- レトロ
- 路地
- 坂道
- 本屋
- アート
- 電気街
- アニメ
- 歴史
- 史跡
- ランドマーク
- 近代建築
- 江戸
- 昭和
- 自然
- 夜景
- ベンチあり
- 人少なめ
- 写真向き

## 8. データ設計

## 8.1 Course

```ts
type Course = {
  id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  areaId: string
  startPointId: string
  endPointId: string
  distanceMeters: number
  durationMinutes: number
  difficulty: 'very_easy' | 'easy' | 'normal' | 'hard'
  estimatedSteps?: number
  routeGeoJson: GeoJSON.LineString
  mainImageUrl?: string
  imageUrls: string[]
  recommendedTimeOfDay: string[]
  cautionNotes?: string
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  createdAt: string
  updatedAt: string
}
```

## 8.2 Area

```ts
type Area = {
  id: string
  slug: string
  name: string
  description: string
  prefecture: string
  city?: string
  mainImageUrl?: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
}
```

## 8.3 Spot

```ts
type Spot = {
  id: string
  slug: string
  name: string
  description?: string
  address?: string
  latitude: number
  longitude: number
  imageUrl?: string
  officialUrl?: string
  createdAt: string
  updatedAt: string
}
```

## 8.4 CourseSpot

```ts
type CourseSpot = {
  id: string
  courseId: string
  spotId: string
  order: number
  title?: string
  description?: string
  stayMinutes?: number
}
```

## 8.5 Tag

```ts
type Tag = {
  id: string
  slug: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}
```

## 8.6 CourseTag

```ts
type CourseTag = {
  courseId: string
  tagId: string
}
```

## 9. 初期データ管理

### 9.1 初期方針

初期版では管理画面を作らず、MarkdownまたはJSONでコースデータを管理する。

おすすめは以下の構成。

```txt
/content
  /courses
    akihabara-kanda-cafe-walk.md
    ueno-yanaka-history-walk.md
  /areas
    akihabara.md
    kanda.md
  /tags
    cafe.md
    history.md
```

または、Next.jsで扱いやすいJSON構成にする。

```txt
/data
  courses.json
  areas.json
  spots.json
  tags.json
```

### 9.2 MVPでの推奨

最初はJSONで十分。

理由：

- 型定義しやすい
- Next.jsで静的生成しやすい
- 管理画面なしで運用できる
- GitHub上で差分管理しやすい
- 後からDBに移行しやすい

## 10. 地図仕様

### 10.1 地図ライブラリ

使用ライブラリ：

- MapLibre GL JS

### 採用理由

- ベクタータイル対応
- 表現力が高い
- 将来的な地図スタイル変更に強い
- OpenStreetMap系データと相性が良い
- モダンな地図表現が可能
- モバイルでの操作感が良い

### 10.2 地図表示内容

- コースルート線
- 開始地点マーカー
- 終了地点マーカー
- 経由スポットマーカー
- 現在表示中のスポット強調

## 11. 検索仕様

## 11.1 検索対象

- コース名
- 説明文
- エリア名
- タグ
- スポット名

## 11.2 絞り込み条件

- エリア
- 所要時間
- 距離
- 難易度
- タグ
- シーン

## 11.3 MVPでの検索実装

初期データ量が少ないため、フロントエンド側でJSONを読み込んで絞り込みを行う。

コース数が数百件を超えたら、バックエンド検索または全文検索を検討する。

## 12. SEO仕様

## 12.1 SEO方針

コース詳細ページ、エリアページ、タグページを静的HTMLとして生成し、検索流入を狙う。

重要な検索キーワード例：

- 秋葉原 散歩コース
- 神田 散歩
- 東京 散歩コース
- 東京 街歩き
- 東京 休日 散歩
- 上野 谷中 散歩
- カフェ 散歩 東京
- 夜散歩 東京

## 12.2 各ページのSEO要素

各ページに以下を設定する。

- title
- description
- canonical URL
- OGP title
- OGP description
- OGP image
- JSON-LD

## 12.3 JSON-LD

コース詳細ページでは以下を検討する。

- `Article`
- `TouristTrip`
- `Place`
- `BreadcrumbList`

MVPでは最低限、`Article` と `BreadcrumbList` を入れる。

## 13. UI/UX方針

## 13.1 デザイン方針

- やわらかい
- 余白がある
- 写真が大きい
- 地図アプリよりも読み物感を出す
- 和風に寄せすぎない
- 観光サイトより軽い印象にする

## 13.2 主要UI

### コースカード

表示項目：

- 画像
- コース名
- エリア
- 所要時間
- 距離
- タグ
- 短い説明

### コース詳細ヘッダー

表示項目：

- メイン画像
- コース名
- 概要文
- 所要時間
- 距離
- 難易度

### ルート説明

スポットごとに時系列で表示する。

例：

1. 秋葉原駅 電気街口から出発
2. 高架下を抜けて神田方面へ
3. 老舗喫茶店の前を通る
4. 神田明神へ向かう
5. 御茶ノ水方面で終了

## 14. 技術構成

## 14.1 MVP構成

- Frontend: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- Map: MapLibre GL JS
- Data: JSON files
- Hosting: Vercel / Cloudflare Pages / GitHub Pages

## 15. ディレクトリ構成案

```txt
sozoroto/
  app/
    page.tsx
    courses/
      page.tsx
      [slug]/
        page.tsx
    areas/
      page.tsx
      [slug]/
        page.tsx
    tags/
      [slug]/
        page.tsx
  components/
    CourseCard.tsx
    CourseMap.tsx
    CourseFilter.tsx
    AreaCard.tsx
    TagList.tsx
  data/
    courses.json
    areas.json
    spots.json
    tags.json
  lib/
    courses.ts
    areas.ts
    tags.ts
    seo.ts
    geo.ts
  public/
    images/
      courses/
      areas/
  types/
    course.ts
    area.ts
    spot.ts
    tag.ts
```

## 16. 初期掲載コース案

## 16.1 秋葉原〜神田カフェ散歩

- エリア: 秋葉原・神田
- 所要時間: 45分
- 距離: 約2.5km
- テーマ: カフェ、電気街、路地、神社

## 16.2 御茶ノ水〜神田明神〜秋葉原散歩

- エリア: 御茶ノ水・秋葉原
- 所要時間: 60分
- 距離: 約3km
- テーマ: 坂、神社、橋、歴史

## 16.3 上野〜谷中レトロ散歩

- エリア: 上野・谷中
- 所要時間: 90分
- 距離: 約4km
- テーマ: レトロ、寺、商店街、猫

## 16.4 浅草〜蔵前ものづくり散歩

- エリア: 浅草・蔵前
- 所要時間: 75分
- 距離: 約3.5km
- テーマ: 川沿い、雑貨、カフェ、下町

## 16.5 日本橋〜人形町老舗散歩

- エリア: 日本橋・人形町
- 所要時間: 60分
- 距離: 約3km
- テーマ: 老舗、甘味、建築、歴史

## 16.6 清澄白河カフェと公園散歩

- エリア: 清澄白河
- 所要時間: 60分
- 距離: 約3km
- テーマ: カフェ、公園、川沿い、現代美術

## 16.7 神保町本屋散歩

- エリア: 神保町
- 所要時間: 45分
- 距離: 約2km
- テーマ: 本屋、喫茶店、古書、カレー

## 17. API仕様案

## 17.1 コース一覧取得

```http
GET /api/courses
```

### Query Parameters

```txt
area=akihabara
tag=cafe
durationMax=60
distanceMax=3000
difficulty=easy
q=カフェ
```

## 17.2 コース詳細取得

```http
GET /api/courses/:slug
```

## 17.3 エリア一覧取得

```http
GET /api/areas
```

## 17.4 タグ一覧取得

```http
GET /api/tags
```

## 18. DB設計

## 18.1 courses

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  area_id UUID NOT NULL,
  distance_meters INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  route_geojson JSONB NOT NULL,
  main_image_url TEXT,
  image_urls JSONB NOT NULL DEFAULT '[]',
  recommended_time_of_day JSONB NOT NULL DEFAULT '[]',
  caution_notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 18.2 areas

```sql
CREATE TABLE areas (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  city TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  main_image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 18.3 spots

```sql
CREATE TABLE spots (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  official_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 18.4 tags

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 18.5 course_spots

```sql
CREATE TABLE course_spots (
  id UUID PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id),
  spot_id UUID NOT NULL REFERENCES spots(id),
  sort_order INTEGER NOT NULL,
  title TEXT,
  description TEXT,
  stay_minutes INTEGER
);
```

## 18.6 course_tags

```sql
CREATE TABLE course_tags (
  course_id UUID NOT NULL REFERENCES courses(id),
  tag_id UUID NOT NULL REFERENCES tags(id),
  PRIMARY KEY (course_id, tag_id)
);
```

## 19. 管理・運用フロー

## 19.1 コース作成フロー

1. 散歩テーマを決める
2. エリアを決める
3. 実際に歩く
4. 写真を撮る
5. 経由スポットを記録する
6. ルートをGeoJSON化する
7. JSONに登録する
8. コース詳細文を書く
9. SEOタイトル・説明文を設定する
10. 公開する

## 19.2 写真ルール

- メイン画像は横長を基本にする
- 顔が大きく写った写真は避ける
- 店内写真は許可がある場合のみ使う
- 看板や外観は問題が起きにくい範囲で利用する
- 夜道や危険に見える写真は避ける

## 19.3 コース品質基準

各コースは以下を満たすこと。

- 実際に歩ける
- 所要時間が現実的
- ルートが不自然ではない
- 途中に休憩候補がある
- 危険な道を避けている
- コースのテーマが明確
- 写真が最低1枚ある
- 地図でルートが確認できる

## 20. 非機能要件

## 20.1 パフォーマンス

- トップページは高速表示する
- 画像は最適化する
- コース詳細は静的生成する
- 地図ライブラリは必要なページでのみ読み込む

## 20.2 アクセシビリティ

- 画像にaltを設定する
- キーボード操作を考慮する
- 色だけで情報を伝えない
- 地図だけに依存せず、テキストでもルートを説明する

## 20.3 レスポンシブ対応

- スマートフォン優先
- 地図はスマホでも見やすくする
- コースカードは縦長表示を基本にする
- PCでは地図と説明を横並びにできるようにする

## 21. リスクと対策

## 21.1 ルート情報の正確性

### リスク

工事、閉鎖、店舗移転などでコース情報が古くなる。

### 対策

- 更新日を表示する
- 注意事項欄を設ける
- 定期的にコースを見直す
- 店舗依存の強いコースは注意書きを入れる

## 21.2 地図タイル利用制限

### リスク

OpenStreetMapタイルを大量アクセスで利用すると制限に触れる可能性がある。

### 対策

- 初期は低トラフィック前提で利用
- アクセス増加時は専用タイルサービスを検討
- MapTiler、Stadia Maps、Jawg Mapsなどへの移行余地を残す

## 21.3 店舗情報の扱い

### リスク

営業時間や休業日が変わる。

### 対策

- 店舗情報は詳細に持ちすぎない
- 公式サイトへのリンクを掲載する
- 「訪問前に公式情報を確認」と記載する

## 23. 初期開発タスク

## 23.1 実装タスク

- Next.jsプロジェクト作成
- Tailwind CSS設定
- データ型定義
- JSONデータ作成
- コース一覧ページ作成
- コース詳細ページ作成
- エリア一覧ページ作成
- タグページ作成
- Leaflet導入
- 地図コンポーネント作成
- SEOメタ情報実装
- OGP画像設定
- レスポンシブ調整

## 23.2 コンテンツ作成タスク

- 初期エリア選定
- 初期コース10件作成
- 写真撮影
- ルート座標作成
- 各コース説明文作成
- タグ設計
- エリア説明文作成

## 24. 成功指標

## 24.1 初期KPI

- 公開コース数
- 検索流入数
- コース詳細ページ閲覧数
- 平均滞在時間
- エリアページ閲覧数
- SNSシェア数

## 25. まとめ

そぞろっとは、東京近辺の散歩コースを紹介するメディア型アプリである。

単なる地図サービスではなく、街の歴史、ランドマーク、建築、文化、地形なども合わせて紹介し、“街を知りながら歩く” 体験を提供する。

運営が質の高い散歩コースを登録し、SEOと地域コンテンツによって流入を増やす構成を採用する。

「東京近辺で散歩したいときに見るサイト」として、軽く、使いやすく、継続的にコースを増やせる構成を目指す。

