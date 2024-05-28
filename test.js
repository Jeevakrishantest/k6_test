import encoding from "k6/encoding"
import http from "k6/http"
import { check, sleep } from "k6"
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js"

const assets = [
  "440641b4-4c1e-4c03-b0e2-532f1d7d28bb",
  "988f1d25-4d5f-48a4-a415-527c6843f902",
  "63f0652e-dbe9-414f-953e-cf7976f77783",
  "bfbe2efc-5139-49d5-b70c-75d6c9dc162a",
  "3a6f58b0-272a-4781-9f9e-3c92aac210e0",
  "42850611-f2b9-42ca-9fde-1102b4e0fb27",
  "c976ff3c-c452-4c23-93d0-4ba564da832f",
  "33c9e5cb-a2d8-43af-a6bb-275804cc684f",
  "0df62a1b-cfdf-4510-8e6c-e20edf153274",
  "dc69f14b-ad13-42a3-806c-b68cf5efb6e8",
  "c27805a7-6ea5-4dca-bcdb-efcb8eceb4c4",
  "51619e1e-c7bf-4890-9dd1-62d0e8c831e3",
  "5414d60b-9e2a-4def-a1ca-c28ae6b65c37",
  "1663dda3-1684-4a2e-bf9a-0384db7b6caf",
  "3b46ce93-4afa-4017-87f0-7ba4c54e91c9",
  "a8404e43-1311-4ddc-9d61-df8b584f3d19",
  "823d32e8-e8fc-4203-871f-beae503ede52",
]

export const options = {
  scenarios: {
    download_center_visitors_download_asset: {
      executor: "constant-arrival-rate",
      // How long the test lasts
      duration: "60s",
      // How many iterations per timeUnit
      rate: 120,
      // Start `rate` iterations per second
      timeUnit: "60s",
      // Pre-allocate VUs
      preAllocatedVUs: 120,
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    // http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
}

export default function () {
  const randomAssetId = randomItem(assets)
  const url = `https://cms-preprod.knauf.digital/api/download-center/v1/assets`
  const username = "tu_spt"
  const password = ""
  const authString = `${username}:${password}`
  const encodedAuth = encoding.b64encode(authString)

  const headers = {
    Authorization: `Basic ${encodedAuth}`,
  }

  const res = http.get(`${url}/${randomAssetId}?download=true`, { headers: headers })

  check(res, {
    "status was 200": (r) => r.status == 200,
    "transaction time OK": (r) => r.timings.duration < 200,
  })

  if (res.status != 200) {
    console.log(`Test Request to ${res.request.url} with status ${res.status}`)
  }
  sleep(1)
}
