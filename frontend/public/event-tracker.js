// public/event-tracker.js

(function () {
    // Ghi nhận khi người dùng truy cập
    if (localStorage.getItem("token") === null) {
        console.log("User visited:", window.location.href);
        const data = {
            eventName: "pageView",
            eventTime: new Date().toISOString(),
            eventData: {
                url: window.location.href,
                location: window.location.pathname,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                screen: {
                    width: screen.width,
                    height: screen.height,
                    colorDepth: screen.colorDepth,
                },
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                cookiesEnabled: navigator.cookieEnabled,
                plugins: Array.from(navigator.plugins).map(plugin => plugin.name),
                doNotTrack: navigator.doNotTrack,
                javaEnabled: navigator.javaEnabled(),
                platform: navigator.platform,
                vendor: navigator.vendor,
                hardwareConcurrency: navigator.hardwareConcurrency,
                deviceMemory: navigator.deviceMemory,
                os: navigator.oscpu,
            }
        };
        console.log("Visit Event:", data);

        // Gửi về server nếu cần
        fetch("https://beenglishcenter.gicunhco.com/api/eventsData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    // public/event-tracker.js

    document.addEventListener("DOMContentLoaded", () => {
    const url = new URL(window.location.href);
    const path = url.pathname;

    // Kiểm tra nếu là trang chi tiết khóa học
    const courseDetailMatch = path.match(/^\/course\/([a-zA-Z0-9]+)$/);
    if (courseDetailMatch) {
        const courseId = courseDetailMatch[1];

        const data = {
            eventName: "viewCourse",
            eventTime: new Date().toISOString(),
            eventData: {
                courseId: courseId,
                url: window.location.href,
                location: window.location.pathname,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                screen: {
                    width: screen.width,
                    height: screen.height,
                    colorDepth: screen.colorDepth,
                },
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                cookiesEnabled: navigator.cookieEnabled,
                plugins: Array.from(navigator.plugins).map(plugin => plugin.name),
                doNotTrack: navigator.doNotTrack,
                javaEnabled: navigator.javaEnabled(),
                platform: navigator.platform,
                vendor: navigator.vendor,
                hardwareConcurrency: navigator.hardwareConcurrency,
                deviceMemory: navigator.deviceMemory,
                os: navigator.oscpu,
            }
        };

        console.log("📦 ViewCourse event (direct access):", data);

        fetch("https://beenglishcenter.gicunhco.com/api/eventsData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }
});

    document.addEventListener("DOMContentLoaded", () => {
        // Ghi nhận sự kiện "Tìm hiểu thêm"
        document.body.addEventListener("click", (e) => {
            const target = e.target;

            if (
                target.tagName === "BUTTON" &&
                target.innerText.trim().toLowerCase() === "view more"
            ) {
                const courseCard = target.closest("[data-course-id]");

                if (courseCard) {
                    const courseId = courseCard.getAttribute("data-course-id");

                    const data = {
                        eventName: "viewCourse",
                        eventTime: new Date().toISOString(),
                        eventData: {
                            courseId: courseId,
                            time: new Date().toISOString(),
                            url: window.location.href,
                            userAgent: navigator.userAgent,
                            screen: {
                                width: screen.width,
                                height: screen.height,
                                colorDepth: screen.colorDepth,
                            },
                            language: navigator.language,
                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            cookiesEnabled: navigator.cookieEnabled,
                            plugins: Array.from(navigator.plugins).map(plugin => plugin.name),
                            doNotTrack: navigator.doNotTrack,
                            javaEnabled: navigator.javaEnabled(),
                            platform: navigator.platform,
                            vendor: navigator.vendor,
                            hardwareConcurrency: navigator.hardwareConcurrency,
                            deviceMemory: navigator.deviceMemory,
                            os: navigator.oscpu,
                        },
                    };


                    console.log("📦 ViewCourse event:", data);

                    // Gửi về server nếu cần
                    fetch("https://beenglishcenter.gicunhco.com/api/eventsData", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    });
                }
            }
        });
    });

    document.addEventListener("DOMContentLoaded", async () => {
        const url = new URL(window.location.href);
        const path = url.pathname;
      
        // 1. Kiểm tra nếu là trang /vnpay_return
        if (path === "/vnpay_return") {
          const transactionId = url.searchParams.get("vnp_TransactionNo");
          const responseCode = url.searchParams.get("vnp_ResponseCode");
          const transactionStatus = url.searchParams.get("vnp_TransactionStatus");
      
          const isSuccess = responseCode === "00" && transactionStatus === "00";
      
          // 2. Chỉ xử lý nếu thanh toán thành công
          if (isSuccess && transactionId) {
            const token = localStorage.getItem("token");
      
            if (!token) {
              console.warn("No token found in localStorage");
              return;
            }
      
            try {
              // 3. Gọi API lấy thông tin giao dịch
              const res = await fetch(`https://beenglishcenter.gicunhco.com/api/payments/transaction/${transactionId}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
      
              const json = await res.json();
      
              if (json.success && json.data) {
                const data = json.data;
      
                const eventData = {
                  eventName: "paymentSuccess",
                  eventTime: new Date().toISOString(),
                  eventData: {
                    transactionId: data.transactionId,
                    courseId: data.courseId,
                    studentId: data.studentId,
                    amount: data.amount,
                    orderId: data.orderId,
                    note: data.note,
                    paidAt: data.paidAt,
                    url: window.location.href,
                    location: window.location.pathname,
                    referrer: document.referrer,
                    userAgent: navigator.userAgent,
                    screen: {
                        width: screen.width,
                        height: screen.height,
                        colorDepth: screen.colorDepth,
                    },
                    language: navigator.language,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    cookiesEnabled: navigator.cookieEnabled,
                    plugins: Array.from(navigator.plugins).map(plugin => plugin.name),
                    doNotTrack: navigator.doNotTrack,
                    javaEnabled: navigator.javaEnabled(),
                    platform: navigator.platform,
                    vendor: navigator.vendor,
                    hardwareConcurrency: navigator.hardwareConcurrency,
                    deviceMemory: navigator.deviceMemory,
                    os: navigator.oscpu,
                  },
                };
      
                console.log("✅ Payment Event Tracked:", eventData);
      
                // Gửi về server nếu cần
                fetch("https://beenglishcenter.gicunhco.com/api/eventsData", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(eventData),
                });
              } else {
                console.error("❌ Failed to fetch transaction details:", json);
              }
            } catch (err) {
              console.error("❌ Error tracking payment event:", err);
            }
          }
        }
      });

    // Ghi nhận thời gian ở lại trang khi người dùng rời đi
    let startTime = Date.now();
    window.addEventListener("beforeunload", function () {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        console.log(`Time spent on page: ${timeSpent} seconds`);
        const data = {
            eventName: "leave",
            eventTime: new Date().toISOString(),
            eventData: {
                timeSpent: timeSpent,
                url: window.location.href,
                location: window.location.pathname,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                screen: {
                    width: screen.width,
                    height: screen.height,
                    colorDepth: screen.colorDepth,
                },
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                cookiesEnabled: navigator.cookieEnabled,
                plugins: Array.from(navigator.plugins).map(plugin => plugin.name),
                doNotTrack: navigator.doNotTrack,
                javaEnabled: navigator.javaEnabled(),
                platform: navigator.platform,
                vendor: navigator.vendor,
                hardwareConcurrency: navigator.hardwareConcurrency,
                deviceMemory: navigator.deviceMemory,
                connection: {
                    type: navigator.connection.type,
                    effectiveType: navigator.connection.effectiveType,
                    rtt: navigator.connection.rtt,
                    downlink: navigator.connection.downlink,
                },
                os: navigator.oscpu,
            }
        };
        console.log("Leave Event:", data);

        // Gửi về server nếu cần
        fetch("https://beenglishcenter.gicunhco.com/api/eventsData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    });
})();