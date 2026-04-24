$content = Get-Content -Raw admin-dashboard.html
$replacement = @"
        <!-- 4. Packages Section -->
        <div id="section-packages" class="dashboard-section">
            <div class="packages-layout">
                <div class="content-card">
                    <div class="card-header">
                        <span>????? / ????? ????</span>
                        <div class="admin-row-actions">
                            <button class="action-btn btn-primary" id="savePlanBtn">??? ??????</button>
                            <button class="action-btn" id="resetPlanBtn">?????</button>
                        </div>
                    </div>
                    <div style="padding: 20px 24px;">
                        <input type="hidden" id="planEditId">

                        <div class="plan-form-grid">
                            <input class="admin-input" id="planNameInput" placeholder="??? ?????? (????: ???????)">
                            <input class="admin-input" id="planPriceInput" type="number" min="0" step="0.01" placeholder="?????">
                            <select class="admin-select" id="planPeriodInput">
                                <option value="monthly">????</option>
                                <option value="quarterly">??? ????</option>
                                <option value="yearly">????</option>
                                <option value="one_time">??? ?????</option>
                            </select>
                            <select class="admin-select" id="planThemeInput">
                                <option value="starter">???? ?????</option>
                                <option value="professional">???? ???????</option>
                                <option value="premium">???? ?????</option>
                                <option value="custom">???? ????</option>
                            </select>
                            <input class="admin-input" id="planBadgeInput" placeholder="??? ?????? ??? ????????? (???????)">
                            <input class="admin-input" id="planPriorityInput" type="number" min="0" step="1" placeholder="?????? ?????? (???)">
                        </div>

                        <div class="plan-form-grid">
                            <input class="admin-input" id="planAccentInput" placeholder="??? ????? (HEX ??? #2563eb)">
                            <input class="admin-input" id="planGradFromInput" placeholder="??? ????? ???????">
                            <input class="admin-input" id="planGradToInput" placeholder="??? ????? ???????">
                        </div>

                        <textarea class="plan-textarea" id="planDescriptionInput" placeholder="??? ??????"></textarea>
                        <textarea class="plan-textarea" id="planFeaturesInput" placeholder="???????? (?? ???? ?? ???)"></textarea>

                        <div class="admin-check-grid">
                            <label class="admin-check"><input type="checkbox" id="benefitVisibilityInput" checked> ???? ?? ??????</label>
                            <label class="admin-check"><input type="checkbox" id="benefitContactInput" checked> ????? ?????? ???????</label>
                            <label class="admin-check"><input type="checkbox" id="benefitImagesInput"> ????? ??? ???????</label>
                            <label class="admin-check"><input type="checkbox" id="benefitTopListInput"> ???? ???? ?? ???????</label>
                            <label class="admin-check"><input type="checkbox" id="benefitTrustedInput"> ????? ??? ?????</label>
                            <label class="admin-check"><input type="checkbox" id="benefitTopProfileInput"> ???? ?? ???? ??????</label>
                            <label class="admin-check"><input type="checkbox" id="planPopularInput"> ???? ????? (?????? ????????)</label>
                            <label class="admin-check"><input type="checkbox" id="planActiveInput" checked> ?????? ?????</label>
                        </div>

                        <div id="planStatusBox" class="status-box"></div>
                        <p class="mini-note">????? ????? ?? ???? ????? ?? ????? ???????? ?? ??????? ??? ??? ?? ?????? ???????.</p>
                    </div>
                </div>

                <div class="content-card">
                    <div class="card-header">
                        <span>????? ???????? ???????</span>
                    </div>
                    <div style="overflow-x: auto;">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>??? ??????</th>
                                    <th>?????</th>
                                    <th>?????</th>
                                    <th>????????</th>
                                    <th>??????</th>
                                    <th>?????????</th>
                                </tr>
                            </thead>
                            <tbody id="packagesBody"></tbody>
                        </table>
                    </div>
                </div>

                <div class="content-card">
                    <div class="card-header">
                        <span>??????? ?????? ??????</span>
                    </div>
                    <div style="overflow-x: auto;">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>?????</th>
                                    <th>??????</th>
                                    <th>???????</th>
                                    <th>?????? ???????</th>
                                    <th>????? ??????</th>
                                </tr>
                            </thead>
                            <tbody id="techPlansBody"></tbody>
                        </table>
                    </div>
                    <div id="techPlanStatusBox" class="status-box" style="margin: 12px 24px 18px;"></div>
                </div>
            </div>
        </div>
    </main>
"@
$content = [regex]::Replace($content, '<!-- 4\. Packages Section -->[\s\S]*?</main>', [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $replacement }, 1)
Set-Content -Path admin-dashboard.html -Value $content
