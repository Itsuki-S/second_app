ポートフォリオ2作目です。アプリ名：Hobby-time

このアプリケーションは動画の視聴時間を記録・管理し、おすすめ動画を他人に共有できるアプリケーションです。
![image](https://user-images.githubusercontent.com/70414500/138575398-0f144142-bfd9-4285-ad44-05d2984dd385.png)
![image](https://user-images.githubusercontent.com/70414500/138575401-fc7249a2-d375-471f-8a63-aa1b6058cffa.png)
![image](https://user-images.githubusercontent.com/70414500/138575410-5046caf4-a6f0-4020-831c-9d8348472dda.png)

バックエンドにRuby on Rails、フロントエンドにAngularを使用しています。
よくYouTubeの動画を見て時間を消費してしまっていたのをちゃんと管理したくて自作しました。

ユーザーが視聴したyoutubeのurlをログとして登録するとYoutube Data Apiから動画の情報を取得し、1日の動画視聴時間を計上します。
ダッシュボードのグラフを通じて1週間の中でどれほど動画を見ていたのかを可視化することができます。
またおすすめがあればログ登録時に紹介文を追加して他人と共有することができます。

ログは一度に複数個登録できるようになっていますが、Youtube Data Apiへのクエリは1つにまとめるようにして処理が遅れないようにしています。
