import bus from "@/components/common/bus";

var pubUrl = ""

function defaultV(e) {
  if (e.value === '' || e.value === undefined) e.value = 0
}

function openNewPage(url) {
  pubUrl = url
}

function getNewPage() {
  return pubUrl
}

export default {
  openNewPage,
  getNewPage
};



