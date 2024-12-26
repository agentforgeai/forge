<!-- markdownlint-disable MD030 -->

<img width="100%" src="https://github.com/AgentForge-SKAIAgentForge/blob/main/images/AgentForge.png?raw=true"></a>

# AgentForge - LLM アプリを簡単に構築

[![Release Notes](https://img.shields.io/github/release/AgentForgeAI/AgentForge)](https://github.com/AgentForge-SKAIAgentForge/releases)
[![Discord](https://img.shields.io/discord/1087698854775881778?label=Discord&logo=discord)](https://discord.gg/jbaHfsRVBW)
[![Twitter Follow](https://img.shields.io/twitter/follow/AgentForgeAI?style=social)](https://twitter.com/AgentForgeAI)
[![GitHub star chart](https://img.shields.io/github/stars/AgentForgeAI/AgentForge?style=social)](https://star-history.com/#AgentForgeAI/AgentForge)
[![GitHub fork](https://img.shields.io/github/forks/AgentForgeAI/AgentForge?style=social)](https://github.com/AgentForge-SKAIAgentForge/fork)

[English](../README.md) | [中文](./README-ZH.md) | 日本語 | [한국어](./README-KR.md)

<h3>ドラッグ＆ドロップでカスタマイズした LLM フローを構築できる UI</h3>
<a href="https://github.com/AgentForge-SKAIAgentForge">
<img width="100%" src="https://github.com/AgentForge-SKAIAgentForge/blob/main/images/AgentForge.gif?raw=true"></a>

## ⚡ クイックスタート

[NodeJS](https://nodejs.org/en/download) >= 18.15.0 をダウンロードしてインストール

1. AgentForge のインストール
    ```bash
    npm install -g AgentForge
    ```
2. AgentForge の実行

    ```bash
    npx AgentForge start
    ```

    ユーザー名とパスワードを入力

    ```bash
    npx AgentForge start --AgentForge_USERNAME=user --AgentForge_PASSWORD=1234
    ```

3. [http://localhost:3000](http://localhost:3000) を開く

## 🐳 Docker

### Docker Compose

1. プロジェクトのルートにある `docker` フォルダに移動する
2. `.env.example` ファイルをコピーして同じ場所に貼り付け、名前を `.env` に変更する
3. `docker compose up -d`
4. [http://localhost:3000](http://localhost:3000) を開く
5. コンテナを停止するには、`docker compose stop` を使用します

### Docker Image

1. ローカルにイメージを構築する:
    ```bash
    docker build --no-cache -t AgentForge .
    ```
2. image を実行:

    ```bash
    docker run -d --name AgentForge -p 3000:3000 AgentForge
    ```

3. image を停止:
    ```bash
    docker stop AgentForge
    ```

## 👨‍💻 開発者向け

AgentForge には、3 つの異なるモジュールが 1 つの mono リポジトリにあります。

-   `server`: API ロジックを提供する Node バックエンド
-   `ui`: React フロントエンド
-   `components`: サードパーティノードとの統合

### 必須条件

-   [PNPM](https://pnpm.io/installation) をインストール
    ```bash
    npm i -g pnpm
    ```

### セットアップ

1. リポジトリをクローン

    ```bash
    git clone https://github.com/AgentForge-SKAIAgentForge.git
    ```

2. リポジトリフォルダに移動

    ```bash
    cd AgentForge
    ```

3. すべてのモジュールの依存関係をインストール:

    ```bash
    pnpm install
    ```

4. すべてのコードをビルド:

    ```bash
    pnpm build
    ```

5. アプリを起動:

    ```bash
    pnpm start
    ```

    [http://localhost:3000](http://localhost:3000) でアプリにアクセスできるようになりました

6. 開発用ビルド:

    - `.env` ファイルを作成し、`packages/ui` に `VITE_PORT` を指定する（`.env.example` を参照）
    - `.env` ファイルを作成し、`packages/server` に `PORT` を指定する（`.env.example` を参照）
    - 実行

        ```bash
        pnpm dev
        ```

    コードの変更は [http://localhost:8080](http://localhost:8080) に自動的にアプリをリロードします

## 🔒 認証

アプリレベルの認証を有効にするには、 `AgentForge_USERNAME` と `AgentForge_PASSWORD` を `packages/server` の `.env` ファイルに追加します:

```
AgentForge_USERNAME=user
AgentForge_PASSWORD=1234
```

## 🌱 環境変数

AgentForge は、インスタンスを設定するためのさまざまな環境変数をサポートしています。`packages/server` フォルダ内の `.env` ファイルで以下の変数を指定することができる。[続き](https://github.com/AgentForge-SKAIAgentForge/blob/main/CONTRIBUTING.md#-env-variables)を読む

## 📖 ドキュメント

[AgentForge ドキュメント](https://docs.AgentForgeai.com/)

## 🌐 セルフホスト

お客様の既存インフラに AgentForge をセルフホストでデプロイ、様々な[デプロイ](https://docs.AgentForgeai.com/configuration/deployment)をサポートします

-   [AWS](https://docs.AgentForgeai.com/deployment/aws)
-   [Azure](https://docs.AgentForgeai.com/deployment/azure)
-   [Digital Ocean](https://docs.AgentForgeai.com/deployment/digital-ocean)
-   [GCP](https://docs.AgentForgeai.com/deployment/gcp)
-   <details>
      <summary>その他</summary>

    -   [Railway](https://docs.AgentForgeai.com/deployment/railway)

        [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/pn4G8S?referralCode=WVNPD9)

    -   [Render](https://docs.AgentForgeai.com/deployment/render)

        [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://docs.AgentForgeai.com/deployment/render)

    -   [Hugging Face Spaces](https://docs.AgentForgeai.com/deployment/hugging-face)

        <a href="https://huggingface.co/spaces/AgentForgeAI/AgentForge"><img src="https://huggingface.co/datasets/huggingface/badges/raw/main/open-in-hf-spaces-sm.svg" alt="Hugging Face Spaces"></a>

    -   [Elestio](https://elest.io/open-source/AgentForgeai)

        [![Deploy](https://pub-da36157c854648669813f3f76c526c2b.r2.dev/deploy-on-elestio-black.png)](https://elest.io/open-source/AgentForgeai)

    -   [Sealos](https://cloud.sealos.io/?openapp=system-template%3FtemplateName%3DAgentForge)

        [![](https://raw.githubusercontent.com/labring-actions/templates/main/Deploy-on-Sealos.svg)](https://cloud.sealos.io/?openapp=system-template%3FtemplateName%3DAgentForge)

    -   [RepoCloud](https://repocloud.io/details/?app_id=29)

        [![Deploy on RepoCloud](https://d16t0pc4846x52.cloudfront.net/deploy.png)](https://repocloud.io/details/?app_id=29)

      </details>

## ☁️ クラウドホスト

[AgentForge Cloud の使い方を始める](AgentForge/)

## 🙋 サポート

ご質問、問題提起、新機能のご要望は、[discussion](https://github.com/AgentForge-SKAIAgentForge/discussions)までお気軽にどうぞ

## 🙌 コントリビュート

これらの素晴らしい貢献者に感謝します

<a href="https://github.com/AgentForge-SKAIAgentForge/graphs/contributors">
<img src="https://contrib.rocks/image?repo=AgentForgeAI/AgentForge" />
</a>

[コントリビューティングガイド](CONTRIBUTING.md)を参照してください。質問や問題があれば、[Discord](https://discord.gg/jbaHfsRVBW) までご連絡ください。
[![Star History Chart](https://api.star-history.com/svg?repos=AgentForgeAI/AgentForge&type=Timeline)](https://star-history.com/#AgentForgeAI/AgentForge&Date)

## 📄 ライセンス

このリポジトリのソースコードは、[Apache License Version 2.0](LICENSE.md)の下で利用可能です。
