const axios = require('axios');
const admin = require('firebase-admin');

// استدعاء ملف الأمان الخاص بك
const serviceAccount = require("./accountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://min-f7cac-default-rtdb.firebaseio.com/"
});

const db = admin.database();
const ref = db.ref("db_matches");

async function updateLiveMatches() {
  try {
    // جلب البيانات الحية من حسابك في apifootball مع إغلاق النص والدالة بشكل صحيح
    const response = await axios.get('https://apifootball.com/api/?action=get_live_pro&APIkey=e050b2bb9abf8333928b6d0013b21b1db3886506ec2aa03710834d4ae4e84bd1');
    const matches = response.data;

    if (!matches || matches.error || Array.isArray(matches) === false || matches.length === 0) {
      console.log("لا توجد مباريات جارية حالياً أو خطأ في الـ API.");
      return;
    }

    let updates = {};
    matches.forEach(item => {
      const matchId = "match_" + item.match_id;
      updates[matchId] = {
        key: matchId,
        dwr: item.league_name,
        tim: item.match_time + "'",
        tea1: item.match_hometeam_name,
        tea2: item.match_awayteam_name,
        teas1: item.match_hometeam_score || "0",
        teas2: item.match_awayteam_score || "0",
        m31k_tx: item.match_live || "LIVE",
        kna_tx: "beIN Sports",
        logo1: item.team_home_badge || "",
        logo2: item.team_away_badge || "",
        logo_d: item.league_logo || ""
      };
    });

    await ref.update(updates);
    console.log(`تم تحديث ${matches.length} مباراة بنجاح تلقائياً!`);
  } catch (error) {
    console.error("حدث خطأ أثناء التحديث:", error);
  }
}

// التحديث المستمر كل 60 ثانية
setInterval(updateLiveMatches, 60000);

// تشغيل فوري بمجرد إقلاع السيرفر
updateLiveMatches();
    console.error("حدث خطأ أثناء التحديث:", error);
  }
}

// التحديث المستمر كل 60 ثانية
setInterval(updateLiveMatches, 60000);

// تشغيل فوري بمجرد إقلاع السيرفر
updateLiveMatches();
