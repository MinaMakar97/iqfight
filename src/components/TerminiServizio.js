import React from "react";

class TerminiServizio extends React.Component {
	render() {
		return (
			<div className="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header" style={{ backgroundColor: "var(--colore-card)", color: "var(--colore-scritte)" }}>
							<h5 className="modal-title" id="exampleModalLongTitle">
								Termini di servizio
							</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							TOS Preview your Terms of Service Website Terms and Conditions of Use 1. Terms By accessing this Website, accessible from
							iqfight.altervista.org, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are
							responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited
							from accessing this site. The materials contained in this Website are protected by copyright and trade mark law. These
							Terms of Service has been created with the help of the Terms of Service Generator and the Terms & Conditions Example. 2.
							Use License Permission is granted to temporarily download one copy of the materials on IQFight's Website for personal,
							non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license
							you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt
							to reverse engineer any software contained on IQFight's Website; remove any copyright or other proprietary notations from
							the materials; or transferring the materials to another person or "mirror" the materials on any other server. This will
							let IQFight to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be
							terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.
							3. Disclaimer All the materials on IQFight’s Website are provided "as is". IQFight makes no warranties, may it be
							expressed or implied, therefore negates all other warranties. Furthermore, IQFight does not make any representations
							concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials
							or any sites linked to this Website. 4. Limitations IQFight or its suppliers will not be hold accountable for any damages
							that will arise with the use or inability to use the materials on IQFight’s Website, even if IQFight or an authorize
							representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction
							does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may
							not apply to you. 5. Revisions and Errata The materials appearing on IQFight’s Website may include technical,
							typographical, or photographic errors. IQFight will not promise that any of the materials in this Website are accurate,
							complete, or current. IQFight may change the materials contained on its Website at any time without notice. IQFight does
							not make any commitment to update the materials. 6. Links IQFight has not reviewed all of the sites linked to its Website
							and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by
							IQFight of the site. The use of any linked website is at the user’s own risk. 7. Site Terms of Use Modifications IQFight
							may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to
							be bound by the current version of these Terms and Conditions of Use. 8. Your Privacy Please read our Privacy Policy. 9.
							Governing Law Any claim related to IQFight's Website shall be governed by the laws of it without regards to its conflict
							of law provisions.
						</div>
						<div className="modal-footer centra">
							<button type="button" className="bottone" data-dismiss="modal">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default TerminiServizio;
