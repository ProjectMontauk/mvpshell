'use client';

import Navbar from '../../../components/Navbar';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function DocsPage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-sm text-gray-400 font-sans mb-2">Research</div>
          <h1 className="text-4xl md:text-5xl font-bold text-black font-sans mb-4">Knowledge Markets</h1>
          
          <div className="font-bold text-black font-sans text-lg mb-4">OUTLINE</div>
          
          <div className="font-mono text-sm text-gray-900 space-y-1 leading-relaxed">
            <div className="pl-0"><strong>1. Introduction</strong></div>
            <div className="pl-0"><strong>2. Single Manipulator Attack</strong></div>
            <div className="pl-4">1. Dynamic Vig</div>
            <div className="pl-4">2. Altered Median</div>
            <div className="pl-0"><strong>3. Multiple Manipulator Attack</strong></div>
            <div className="pl-4">1. Max Purchase Limits</div>
            <div className="pl-4">2. KYC</div>
            <div className="pl-4">3. Median Settlement</div>
            <div className="pl-4">4. Daily Price Change Caps</div>
            <div className="pl-4">5. Threat of Fund Seizure</div>
          </div>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-black font-sans mb-3">Introduction</h2>
            <p className="text-gray-800 leading-7 mb-4">
              Knowledge markets align incentives to surface, evaluate, and fund the discovery of
              high-value information. By pricing hypotheses and rewarding updates toward truth,
              these markets coordinate attention and capital toward questions that matter. 
              Knowledge markets have two periods during their lifecycle:
            </p>
            
            <div className="mb-6">
              <p className="text-gray-800 leading-7 mb-3">
                The Discovery Period is the first phase of a knowledge market that runs for a select period of time.
                To start, the discovery period will be 5 months and during this period traders are able to buy/sell shares
                and share information in the evidence section. During the discovery period, the market collects
                all relevant information about each claim and then prices the probability that each claim is true given the information shared. 
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-800 leading-7 mb-3">
                The Settlement Period begins immediately after the Discovery Period and runs for 
                one month. Like the Discovery Period, the market remains fully open to buying, 
                selling, and sharing information. The only difference is that during the settlement
                period, the median price is recorded and used to determine the final settlement price of the market.
                After the settlement period ends, the market is resolved and the payouts are distributed to the 
                traders based on the median price recorded during this period. 
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-800 leading-7 mb-3">
                The primary problem with Knowledge Markets is exploitation. This paper will outline how 
                manipulators can attack the market and how the installed protocols can protect against these attacks.
              </p>
            </div>
          </section>        

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-black font-sans mb-3">Single Manipulator Attack</h2>
            <p className="text-gray-800 leading-7 mb-4">
              A Single Manipulator Attack is conducted by one trader who attempts to distort the
              market price to their advantage. This attack can occur during both the Discovery
              and Settlement period. However, it is unprofitable for the manipulator to sell their position
              prior to settlement since they would experience normal price slippage. 
            </p>
            <p className="text-gray-800 leading-7 mb-4">
              The primary strategy for a manipulator is to buy a large number of shares to increase the median price
              during the settlement period. Once the settlement period ends, the manipulator can redeem their shares at 
              a higher price per share than their average cost per share if they succeed in increasing the median price.
            </p>
            <div className="text-gray-800 leading-7">
              The section below introduces the formulas used to calculate manipulator profits and explain the assumptions made in the simulated markets.
              After the introduction to manipulation, the paper will outline the possible mitigations that can be installed to mitigate these attacks.
            </div>
          </section>

          <section className="mt-10">
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-black font-sans mb-4">Formulas</h3>
              <p className="text-gray-800 leading-7 mb-4 text-lg">
                Profit = Payout - Cost
              </p>
              
              <div className="my-4 text-xl md:text-2xl" style={{ textAlign: 'left', width: '100%' }}>
                <BlockMath>{String.raw`\text{Profit} = \big(X \cdot \text{med}(x) \cdot (1 - v)\big) - \big( C(\mathbf{q}') - C(\mathbf{q}) \big)`}</BlockMath>
              </div>
              
              <div className="my-4 text-lg md:text-xl" style={{ textAlign: 'left', width: '100%' }}>
                <BlockMath>{String.raw`\text{Profit} = \left( x \cdot \left( \frac{ e^{\frac{q_1 + x}{b}} }{ e^{\frac{q_1 + x}{b}} + e^{\frac{q_2}{b}} } \right) \cdot (1 - v) \right)
                - \left( \; b\,\ln\!\left( e^{\frac{q_1 + x}{b}} + e^{\frac{q_2}{b}} \right) \; - \; b\,\ln\!\left( e^{\frac{q_1}{b}} + e^{\frac{q_2}{b}} \right) \right)`}</BlockMath>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-black font-sans mb-4">Variables</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-7">
                <li>X = Yes shares purchased by manipulator</li>
                <li>q₁ = Number of Yes shares purchased by other traders</li>
                <li>q₂ = Number of No shares purchased by other traders</li>
                <li>v = Vig</li>
                <li>b = Liquidity parameter</li>
              </ul>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-xl font-bold text-black font-sans mb-4">Assumptions</h3>
            <ol className="list-decimal pl-6 space-y-3 text-gray-800 leading-7 text-base">
              <li>Two outcomes in the market.</li>
              <li>The profit-maximizing manipulator will buy one side of the market since buying the other side would damage their potential self-generated profits from the conflicting price movements.</li>
              <li>
                The maximum that an individual manipulator can affect the final median settlement price from their own price movement is the normal pricing function. In an idealized environment for a manipulator, there are no active traders during the settlement period so the manipulator will have complete control over median settlement price. As a result, the median settlement price, represented by med(x) in the payout formula, is the normal pricing function since only the manipulator can affect a price change in the idealized environment:
                <div className="mt-3 mb-3">
                  <img 
                    src="/Pricing.png" 
                    alt="Pricing Function" 
                    width="400" 
                    height="200" 
                    className="w-full max-w-md h-auto"
                  />
                </div>
              </li>
              <li>Any trades against the manipulator would drive down median settlement price, thus hurting profits from the self-generated price movement.</li>
              <li>Any trades in support of the manipulator would drive up median settlement price, but these gains would be legitimate since the added price movement is not self-generated.</li>
            </ol>
          </section>

          <section className="mt-10">
            <h3 className="text-xl font-bold text-black font-sans mb-4">How Manipulators Profit</h3>
            <p className="text-gray-800 leading-7 mb-4 text-base">
              To simulate how a manipulator can profit in an unprotected market, let&apos;s set the following market parameters:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-800 leading-7 text-base mb-4">
              <li>b = 10000 (market seed cost = $6931)</li>
              <li>q₁ = 0</li>
              <li>q₂ = 0</li>
              <li>vig = 3%</li>
            </ol>
            <p className="text-gray-800 leading-7 text-base mb-4">
              The manipulator is going to buy shares to increase the median price during the settlement period. Since it is an idealized environment,
              there are no other traders in the market so the manipulator will have complete control over the median price. Let&apos;s graph the manipulator&apos;s profits 
              as they buy more shares from the nuetral market postions of q₁ & q₂ = 0.
            </p>
            

            
            <div className="mt-6 mb-4">
              <img 
                src="/ManipPro.png" 
                alt="Manipulator Profit Graph" 
                className="w-full max-w-full h-auto"
              />
            </div>
            <p className="text-gray-800 leading-7 text-base mb-4">
              When Q₁ and Q₂ are zero, the manipulator will profit any time they buy more than 1279 shares. 
              The manipulator can yield a profit of $5,040 after buying 50,995 shares which means they will drive the Yes market odds from 50% to 99.39%. 
              In an unprotected market, the market is vulnerable to manipulators and the market odds will likely not reflect the geniune beliefs of the traders.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-black font-sans mb-3">Preventing Manipulation</h2>
            <p className="text-gray-800 leading-7 mb-4 text-base">
              The following mitigations can be implemented to prevent profitable manipulation:
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-gray-800 leading-7 text-base">
              <li>
                <strong>Dynamic Vig:</strong> On any profitable manipulation trade, increase the vig so that the manipulator&apos;s payout is sufficiently discounted to prevent profits. At redemption, the vig needs to be calculated and applied separately for each trade.
              </li>
              <li>
                <strong>Altered Median in Redemption:</strong> The redemption price for each trader will the be the median price over the settlement period minus the shares purchased by each trader. This way traders do not make money from any movement in price due to their own purchasing behavior. Traders can only make money when other traders buy their position naturally pushing the median price up.
              </li>
            </ol>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-black font-sans mb-3">Dynamic Vig</h2>
            <p className="text-gray-800 leading-7 mb-4 text-base">
              A Dynamic Vig needs to adjust to discount manipulator payouts to prevent profits from self-generated price movements.
              The updated payout formula is the normal payout formula only with a Dynamic Vig:
            </p>

            <div className="my-4 text-xl md:text-2xl" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Payout} = X \cdot \left( \frac{ e^{\frac{q_1 + x}{b}} }{ e^{\frac{q_1 + x}{b}} + e^{\frac{q_2}{b}} } \right) \cdot \big( 1 - \text{Dynamic Vig} \big)`}</BlockMath>
            </div>

            <div className="my-6 text-lg md:text-xl" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Dynamic Vig} = \frac{1}{\; \dfrac{\; b\,\ln\!\left( e^{\frac{q_1 + x}{b}} + e^{\frac{q_2}{b}} \right)\; -\; b\,\ln\!\left( e^{\frac{q_1}{b}} + e^{\frac{q_2}{b}} \right)\;}{\; X \cdot \left( \dfrac{ e^{\frac{q_1 + x}{b}} }{ e^{\frac{q_1 + x}{b}} + e^{\frac{q_2}{b}} } \right)\; }} `}</BlockMath>
            </div>

            <p className="text-gray-800 leading-7 mb-4 text-base">
              Assume the market is at the neutral market position:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-800 leading-7 text-base mb-6">
              <li>b = 10000 (market seed cost = $6,931)</li>
              <li>q₁ = 0</li>
              <li>q₂ = 0</li>
              <li>vig = 3%</li>
            </ol>

            <p className="text-gray-800 leading-7 text-base mb-4">
              Below is a graph of the how the dynamic vig increases as the manipulator purchases more shares to prevent self-generated profitable price movements:
            </p>

            <div className="mt-2 mb-6">
              <img
                src="/sha.png"
                alt="Dynamic vig schedule versus shares purchased"
                className="w-full max-w-full h-auto"
              />
            </div>
          </section>

          <section className="mt-6">
            <p className="text-gray-800 leading-7 text-base mb-4">
              When the manipulator purchases 20,000 yes shares, the Dynamic Vig will increase to 18.6% to prevent the manipulator from profiting from the price movement caused by their trade. Below are the calculations demonstrating how the dynamic vig is applied:
            </p>

            <div className="space-y-4">
              <div className="my-4 text-lg md:text-xl" style={{ textAlign: 'left', width: '100%' }}>
                <BlockMath>{String.raw`P(20000,0) = \frac{e^{\frac{20000}{10000}}}{e^{\frac{20000}{10000}} + e^{0}}`}</BlockMath>
              </div>
              <div className="my-4 text-lg md:text-xl" style={{ textAlign: 'left', width: '100%' }}>
                <BlockMath>{String.raw`\text{Profit} = \left(X \cdot P(20000,0) \cdot (1 - \text{Dynamic Vig})\right) - \left(\left(10000 \cdot \ln\left(e^{\frac{20000}{10000}} + e^{0}\right)\right) - \left(10000 \cdot \ln(2)\right)\right)`}</BlockMath>
              </div>
              <div className="my-4 text-lg md:text-xl" style={{ textAlign: 'left', width: '100%' }}>
                <BlockMath>{String.raw`\text{Profit} = \left(20000 \cdot 0.8808 \cdot (1 - 0.186)\right) - \left(\left(10000 \cdot \ln\left(e^{\frac{20000}{10000}} + e^{0}\right)\right) - \left(10000 \cdot \ln(2)\right)\right)`}</BlockMath>
              </div>
              <div className="text-gray-900 font-serif text-xl mb-4" style={{ textAlign: 'left', width: '100%' }}>
                <BlockMath>{String.raw`\text{Profit} = \$0.00`}</BlockMath>
              </div>
              <h5 className="text-xl font-bold text-black font-sans mb-3">Notes on Dynamic Vig</h5>
              <p className="text-gray-800 leading-7 text-base">
            The dynamic vig is applied when the trader is redeeming their shares. It works like a discount that the market maker applies to the trader&apos;s shares upon redemption. 
            To calculate the dynamic vig, the market maker needs to save the exact market state before and after each trade which cannot be saved on chain. 
            </p>
            </div>
          </section>
          
          {/* Removed Altered Median Price section */}

          {/* Removed Altered Median Settlement section */}

          <section className="mt-10">
            <h2 className="text-xl font-bold text-black font-sans mb-3">Altered Median Redemption Function</h2>
            <p className="text-gray-800 leading-7 text-base mb-4">
              The Altered Median Redemption prevents manipulators from profiting from their own self-generated price movements by simulating the price slippage that occurs when a trader sells their shares on the open market.
              The Altered Median Redemption function works like the normal sale function but the Cost Before term is the median settlement state:  
            </p>
            <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Refund} = C_{\text{before}} - C_{\text{after}}`}</BlockMath>
            </div>
            <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`C_{\text{before}} = \text{Median Settlement State}`}</BlockMath>
            </div>
            <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`C_{\text{after}} = \text{Median Settlement State} - \text{Shares Purchased by Participant}`}</BlockMath>
            </div>
            <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Refund} = \left(10000 \cdot \ln\left(e^{\frac{\text{set}(q_1)}{b}} + e^{\frac{\text{set}(q_2)}{b}}\right)\right) - \left(10000 \cdot \ln\left(e^{\frac{\text{set}(q_1) - x_1}{b}} + e^{\frac{\text{set}(q_2)}{b}}\right)\right)`}</BlockMath>
            </div>
            <ul className="list-none pl-0 text-gray-800 leading-7 text-base space-y-2 mb-4">
              <li>set(q₁) = median settlement quantity for yes shares</li>
              <li>set(q₂) = median settlement quantity for no shares</li>
              <li>X₁ = yes shares purchased</li>
            </ul>
            <p className="text-gray-800 leading-7 text-base mb-4">
              Users can redeem their shares for the exact amount that they could have sold them on the open market. The advantage for waiting until redemption is that the vig is not applied and this provides a small incentive for traders not to sell prior to settlement. 
            </p>
            <p className="text-gray-800 leading-7 text-base mb-4">
              Let&apos;s walk through a small example of how a manipulator could not profit even with full control over the settlement price:
              
            </p>
            <p className="text-gray-800 leading-7 mb-4 text-base">
              Assume the market is at the neutral market position:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-800 leading-7 text-base mb-6">
              <li>b = 10000 (market seed cost = $6,931)</li>
              <li>q₁ = 0</li>
              <li>q₂ = 0</li>
              <li>vig = 3%</li>
            </ol>
          </section>
          <p className="text-gray-800 leading-7 text-base mb-4">
              The manipulator pays $23,025 to buy 29,444 yes shares and drives the yes market price to 95%. In a normal median market, the manipulator can yield a profit of $4,946 after redeeming their shares at the median price of 95 cents ($27,970 - $23,025 = $4,946). 
          </p>

          <p className="text-gray-800 leading-7 text-base mb-4">
              However in an altered median redemption market, the manipulator will not be able to profit as shown in the calculation below: 
          </p>

          <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
            <BlockMath>{String.raw`\text{Payout} = \left(10000 \cdot \ln\left(e^{\frac{29444}{10000}} + e^{\frac{0}{10000}}\right)\right) - \left(10000 \cdot \ln\left(e^{\frac{29444-29444}{10000}} + e^{0}\right)\right)`}</BlockMath>
          </div>
          <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
            <BlockMath>{String.raw`\text{Payout} = 23{,}025`}</BlockMath>
          </div>
          <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
            <BlockMath>{String.raw`\text{Cost} = 23{,}025`}</BlockMath>
          </div>
          <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
            <BlockMath>{String.raw`\text{Profit} = Payout - Cost`}</BlockMath>
          </div>
          <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
            <BlockMath>{String.raw`\text{Profit} = 23{,}025 - 23{,}025`}</BlockMath>
          </div>
          <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
            <BlockMath>{String.raw`\text{Profit} = 0`}</BlockMath>
          </div>

          <p className="text-gray-800 leading-7 text-base mb-4">
              In the altered median redemption market, the manipulator does not profit because the price effect of their trades does not increase the redemption payout.
          </p>
          <section className="mt-10">
            <h3 className="text-xl font-bold text-black font-sans mb-3">Notes on Altered Median Redemption</h3>
            <p className="text-gray-800 leading-7 text-base mb-4">
              The altered median redemption market is solvent since for every value in purchasing space, the payouts are less than the normal median redemption function due to altered median redemption function penalizing for self-generated price movements. 
            </p>
            <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath math="\text{Normal Redemption Function} = \text{Shares Purchased} \cdot \text{Median Settlement Price}" />
            </div>

            <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath math="\text{Altered Median Redemption} = \text{Median Settlement State} - (\text{Median Settlement State} - \text{Shares Purchased by Participant})" />
            </div>

            <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath math="\text{Normal Redemption Function}(q_1, q_2, x) > \text{Altered Median Redemption}(q_1, q_2, x)" />
            </div>

            <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath math="X \cdot \text{med}(x) > C(\text{Median Settlement State}) - C(\text{Median Settlement State} - \text{Shares Purchased by Participant})" />
            </div>

            <div className="my-4" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath math="x \cdot \frac{e^{\frac{q_1}{b}}}{e^{\frac{q_1}{b}} + e^{\frac{q_2}{b}}} > \left( 10000 \cdot \ln\left(e^{\frac{q_1}{b}} + e^{\frac{q_2}{b}}\right) \right) - \left( 10000 \cdot \ln\left(e^{\frac{q_1 - x_1}{b}} + e^{\frac{q_2}{b}}\right) \right)" />
            </div>

            <p className="text-gray-800 leading-7 text-base mb-4">
              The inequality above can be proved for all positive values of q1, q2, and x1. Intutively, it makes sense that the normal redemption function is greater than the altered median redemption function since the altered
              median redemption function deducts price slippage, while the normal redemption function redeems the user at the median price during settlement. 
            </p>
            <p className="text-gray-800 leading-7 text-base">
              A possible problem with the altered median redemption function is how is the median settlement state determined? 
              At expiration, the market will have a certain purchase state, but traders will redeem their shares based on the median settlement state which is not the same as the purchase state at expiration. 
              So will the market maker be able to meet payout obligations at redemption? This topic will be handled in another paper. 
            </p>
          </section>

          <section className="mt-10">
          <h3 className="text-xl font-bold text-black font-sans mb-3">Conclusion on Preventing Single Trader Manipulation</h3>
          <p className="text-gray-800 leading-7 text-base">
              Altered median redemption is the best way to settle the market to prevent manipulators from profiting from their own price movements because it is easier to implement than the dynamic vig and easier to understand for traders since it is the same function as the normal sale function used in the open market.  
          </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-black font-sans mb-3">Multiple Manipulator Attack</h2>
            <p className="text-gray-800 leading-7 text-base mb-4">
              A Multiple Manipulator Attack occurs when two or more actors coordinate to move the market price in the same direction. Compared with a single trader attack, multiple manipulators can distribute purchases across identities to evade penalties from an altered median redemption market. 
              Since single trader manipulation trades result in zero profit in an altered median redemption market, multiple manipulators can coordinate to profit since the deduction applied due to the price movement is split between them. Below is an example of how multiple manipulators can profit: 
            </p>

            <p className="text-gray-800 leading-7 mb-4 text-base">
              Assume the market is at the neutral market position in an altered median redemption market:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-800 leading-7 text-base mb-6">
              <li>b = 10000 (market seed cost = $6,931)</li>
              <li>q₁ = 0</li>
              <li>q₂ = 0</li>
              <li>vig = 3%</li>
            </ol>

            <p className="text-gray-800 leading-7 mb-4 text-base">
              The manipulators will push the market price to 94% for Yes by buying between 28,000 shares in total. The first manipulator buys 14,000 shares from the neutral market state for the following price: 
            </p>
            <div className="my-4 text-base md:text-lg" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Cost Trader 1} = \left(10000 \cdot \ln\left(e^{\frac{14000}{10000}} + e^{0}\right)\right) - \left(10000 \cdot \ln(2)\right)`}</BlockMath>
            </div>
            <div className="my-4 text-base md:text-lg" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Cost Trader 1} = \$9{,}272`}</BlockMath>
            </div>
            <p className="text-gray-800 leading-7 mb-4 text-base">
              The second trader buys another 14,000 shares this time with q1 being 14,000 shares due to their partner&apos;s purchase. The cost of the second trader&apos;s purchase is below: 
            </p>
            <div className="my-4 text-base md:text-lg" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Cost Trader 2} = \left(10000 \cdot \ln\left(e^{\frac{28000}{10000}} + e^{0}\right)\right) - \left(10000 \cdot \ln\left(e^{\frac{14000}{10000}}\right)\right)`}</BlockMath>
            </div>
            <div className="my-4 text-base md:text-lg" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Cost Trader 2} = \$14{,}590`}</BlockMath>
            </div>
            <p className="text-gray-800 leading-7 mb-4 text-base">
              The traders successfully pushed the market price to 94% for Yes by spending $23,862 in total. There are no other active traders in this market and 
              94% for Yes is the median settlement price. The altered median redemption payout for each trader is below: 
            </p>
            <div className="my-4 text-base md:text-lg" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Payout Trader 1 \& 2} = \left(10000 \cdot \ln\left(e^{\frac{28000}{10000}} + e^{0}\right)\right) - \left(10000 \cdot \ln\left(e^{\frac{14000}{10000}} + e^{0}\right)\right)`}</BlockMath>
            </div>
            <div className="my-4 text-base md:text-lg" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Payout Trader 1 \& 2} = \$12{,}386`}</BlockMath>
            </div>
            <div className="my-4 text-base md:text-lg" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Total Manipulator Payout} = \$12{,}836 \times 2`}</BlockMath>
            </div>
            <div className="my-4 text-base md:text-lg" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Total Manipulator Payout} = \$24{,}772`}</BlockMath>
            </div>
            <p className="text-gray-800 leading-7 mb-4 text-base">
              Below is the Profit Calculation for the manipulators:  
            </p>
            <div className="my-4 text-base md:text-lg" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Profit Trader 1 \& 2} = \$24{,}772 - (\$9{,}272 + \$14{,}590)`}</BlockMath>
            </div>
            <div className="my-4 text-base md:text-lg" style={{ textAlign: 'left', width: '100%' }}>
              <BlockMath>{String.raw`\text{Profit Trader 1 \& 2} = \$910`}</BlockMath>
            </div>
            <p className="text-gray-800 leading-7 mb-4 text-base">
              As demonstrated above, multiple manipulators can coordinate to profits in an altered median redemption market by splitting the deduction applied due to the price movement.   
            </p>
            <h3 className="text-xl font-bold text-black font-sans mb-3 mt-6">Preventing Multiple Manipulator Attacks</h3>
            <p className="text-gray-800 leading-7 text-base mb-4">
                There are several mitigations that can be implemented to prevent multiple manipulator attacks:
            </p>
            <ol className="list-decimal pl-6 space-y-4 text-gray-800 leading-7 text-base mb-4">
              <li>
                <strong>Max Purchase Limits:</strong> A single trader is only allowed to move the market 10%. The cumulative price impact of their trades will be tracked and no account&apos;s trades can produce a cumulative price impact greater than 10%. This can easily be enforced on the front-end and results in manipulators needing to coordinate with other real identities to carry out attacks. 
              </li>
              <li>
                <strong>KYC (Know Your Customer):</strong> Identity verification that ties each trading account to a real-world identity. KYC makes sybil attacks expensive by requiring manipulators to recruit or procure actual identities rather than creating disposable accounts. This raises the cost of coordination since each participant must be a verified individual. 
              </li>
              <li>
                <strong>Median Settlement:</strong> Settlement uses the median price over the last month of the market. 
                This means manipulators need to effect the market odds more than 50% of the time during the settlement period to have any effect on the market. Attempts to manipulate the market odds early in the settlement period provide other traders plenty of time to trade against the manipulators, confusing their desired price movement. 
              </li>
              <li>
                <strong>Daily Price Change Caps:</strong> A absolute 15% limit on total price change per market day prevents rapid price changes associated with multiple manipulator attacks. This ensures that even well-funded coalitions cannot force prices to extreme levels quickly; instead, they must sustain pressure over multiple days, giving the market time to respond. The daily cap forces manipulators to spread attacks across time, increasing both coordination complexity and the opportunity for detection.
              </li>
              <li>
                <strong>Threat of Fund Seizure:</strong> The possibility of losing funds for coordinated manipulation creates significant deterrent risk. By maintaining the authority to seize or freeze funds associated with suspicious trading patterns, the market creates asymmetric risk for manipulators—they risk losing not just their manipulation profits but their entire capital. This threat, especially when combined with KYC identity verification, makes coordinated attacks financially hazardous beyond just their execution costs.
              </li>
            </ol>
            <p className="text-gray-800 leading-7 text-base mb-4">
              Together, these five measures create layered friction that makes multiple manipulator attacks significantly more difficult. Coalitions must coordinate real identities, spread purchases across time and accounts, extend attacks over multiple days, and overcome settlement mechanics that average out spiky activity all while facing the threat of fund seizure.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
