var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = VLBIImagePriors","category":"page"},{"location":"#VLBIImagePriors","page":"Home","title":"VLBIImagePriors","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for VLBIImagePriors.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [VLBIImagePriors]","category":"page"},{"location":"#VLBIImagePriors.AngleTransform","page":"Home","title":"VLBIImagePriors.AngleTransform","text":"AngleTransform\n\nA transformation that moves two vector x and y to an angle θ.  Note that is x and y are normally distributed then the resulting distribution in θ is uniform on the circle.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.CenteredImage","page":"Home","title":"VLBIImagePriors.CenteredImage","text":"CenteredImage(x, y, σ, p)\n\nRegularizes a general image prior p such that the center of light is close the the origin of the imag. After regularization the log density of the prior is modified to\n\n    log p(I) to log p(I) - frac(x_C^2 + y_C^2)^22sigma^2 N_x N_y\n\nwhere N_x and N_y are the number of pixels in the x and y direction of the image, and x_C y_C are the center of light of the image I.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.DiagonalVonMises","page":"Home","title":"VLBIImagePriors.DiagonalVonMises","text":"DiagonalVonMises(μ::Real, κ::Real)\nDiagonalVonMises(μ::AbstractVector{<:Real}, κ::AbstractVector{<:Real})\n\nConstructs a Von Mises distribution, with mean μ and concentraion parameter κ. If μ and κ are vectors then this constructs a independent multivariate Von Mises distribution.\n\nNotes\n\nThis is a custom implementation since the version in Distributions.jl has certain properties that do not play well (having an support only between [-π+μ, π+μ]) with usual VLBI problems. Additionally this distribution has a special overloaded product_distribution method so that concatenating multiple DiagonalVonMises together preserves the type. This is helpful for Zygote autodiff.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.GaussMarkovRandomField","page":"Home","title":"VLBIImagePriors.GaussMarkovRandomField","text":"struct GaussMarkovRandomField{T, M<:AbstractArray{T, 2}, P, C, TDi} <: VLBIImagePriors.MarkovRandomField\n\nA image prior based off of the first-order Gaussian Markov random field. This is similar to the combination of L₂ and TSV regularization and is equal to\n\nλ TSV(I-M) + Σ⁻¹L₂(I-M) + lognorm(λ, Σ)\n\nwhere λ and Σ are given below and M is the mean image and lognorm(λ,Σ) is the log-normalization of the random field and is needed to jointly infer I and the hyperparameters λ, Σ.\n\nFields\n\nm\nThe mean image of the Gaussian Markov random field\n\nλ\nThe inverse correlation length of the random field.\n\nΣ\nThe variance of the random field\n\ncache\nThe Markov Random Field cache used to define the specific Markov random field class used.\n\ndims\nThe dimensions of the image.\n\nExamples\n\njulia> mimg = zeros(6, 6) # The mean image\njulia> λ, Σ = 2.0, 1.0\njulia> d = GaussMarkovRandomField(mimg, λ, Σ)\njulia> cache = MarkovRandomFieldCache(mimg) # now instead construct the cache\njulia> d2 = GaussMarkovRandomField(mimg, λ, Σ, cache)\njulia> invcov(d) ≈ invcov(d2)\ntrue\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.GaussMarkovRandomField-Tuple{AbstractMatrix, Any, Any, MarkovRandomFieldCache}","page":"Home","title":"VLBIImagePriors.GaussMarkovRandomField","text":"GaussMarkovRandomField(mean::AbstractMatrix, λ, Σ, cache::MarkovRandomFieldCache)\n\nConstructs a first order Gaussian Markov random field with mean image mean and inverse correlation λ and diagonal covariance Σ and the precomputed MarkovRandomFieldCache cache.\n\n\n\n\n\n","category":"method"},{"location":"#VLBIImagePriors.GaussMarkovRandomField-Tuple{AbstractMatrix, Any, Any}","page":"Home","title":"VLBIImagePriors.GaussMarkovRandomField","text":"GaussMarkovRandomField(mean::AbstractMatrix, λ, Σ)\n\nConstructs a first order Gaussian Markov random field with mean image mean and inverse correlation λ and diagonal covariance Σ.\n\n\n\n\n\n","category":"method"},{"location":"#VLBIImagePriors.GaussMarkovRandomField-Tuple{ComradeBase.AbstractModel, ComradeBase.AbstractDims, Vararg{Any}}","page":"Home","title":"VLBIImagePriors.GaussMarkovRandomField","text":"GaussMarkovRandomField(mean::ComradeBase.AbstractModel, grid::ComradeBase.AbstractDims, λ, Σ [,cache]; transform=identity)\n\nCreate a GaussMarkovRandomField object using a ComradeBase model.\n\nArguments\n\nmean: A ComradeBase model that will define the mean image\ngrid: The grid on which the image of the model will be created. This calls ComradeBase.intensitymap.\nλ: The inverse correlation length of the GMRF\nΣ: The variance of the GMRF\ncache: Optionally specify the precomputed MarkovRandomFieldCache\n\nKeyword Arguments\n\ntransform = identity: A transform to apply to the image when creating the mean image. See the examples.\n\nExamples\n\njulia> m1 = GaussMarkovRandomField(Gaussian(), imagepixels(10.0, 10.0, 128, 128), 5.0, 1.0; transform=alr)\njulia> cache = MarkovRandomFieldCache(Gaussian(), imagepixels(10.0, 10.0, 128, 128), 5.0, 1.0; transform=alr)\njulia> m2 = GaussMarkovRandomField(Gaussian(), imagepixels(10.0, 10.0, 128, 128), 5.0, 1.0, cache; transform=alr)\njulia> m1 == m2\ntrue\n\n\n\n\n\n","category":"method"},{"location":"#VLBIImagePriors.ImageDirichlet","page":"Home","title":"VLBIImagePriors.ImageDirichlet","text":"ImageDirichlet(α::AbstractMatrix)\nImageDirichlet(α::Real, ny, nx)\n\nA Dirichlet distribution defined on a matrix. Samples from this produce matrices whose elements sum to unity. This is a useful image prior when you want to separately constrain the flux. The  α parameter defines the usual Dirichlet concentration amount.\n\nNotes\n\nMuch of this code was taken from Distributions.jl and it's Dirichlet distribution. However, some changes were made to make it faster. Additionally, we use define a custom rrule to speed up derivatives.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.ImageSimplex","page":"Home","title":"VLBIImagePriors.ImageSimplex","text":"ImageSimplex(ny,nx)\n\nThis defines a transformation from ℝⁿ⁻¹ to the n probability simplex defined on an matrix with dimension ny×nx. This is a more natural transformation for rasterized images, which are most naturally represented as a matrix.\n\nNotes\n\nMuch of this code was inspired by TransformVariables. However, we have specified custom rrules using Enzyme as a backend. This allowed the simplex transform to be used with Zygote and we achieved an order of magnitude speedup when computing the pullback of the simplex transform.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.ImageSphericalUniform","page":"Home","title":"VLBIImagePriors.ImageSphericalUniform","text":"ImageSphericalUniform(nx, ny)\n\nConstruct a distribution where each image pixel is a 3-sphere uniform variable. This is useful for polarization where the stokes parameters are parameterized on the 3-sphere.\n\nCurrently we use a struct of vectors memory layout. That is the image is described by three matrices (X,Y,Z) grouped together as a tuple, where each matrix is one direction on the sphere, and we require norm((X,Y,Z)) == 1.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.ImageUniform","page":"Home","title":"VLBIImagePriors.ImageUniform","text":"ImageUniform(a::Real, b::Real, nx, ny)\n\nA uniform distribution in image pixels where a/b are the lower/upper bound for the interval. This then concatenates ny×nx uniform distributions together.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.MarkovRandomFieldCache","page":"Home","title":"VLBIImagePriors.MarkovRandomFieldCache","text":"struct MarkovRandomFieldCache{A, TD, M}\n\nA cache for a Markov random field.\n\nFields\n\nΛ\nIntrinsic Gaussian Random Field pseudo-precison matrix. This is similar to the TSV regularizer\n\nD\nGaussian Random Field diagonal precision matrix. This is similar to the L2-regularizer\n\nλQ\nThe eigenvalues of the Λ matrix which is needed to compute the log-normalization constant of the GMRF.\n\nExamples\n\njulia> mean = zeros(2,2) # define a zero mean\njulia> cache = GRMFCache(mean)\njulia> prior_map(x) = GaussMarkovRandomField(mean, x[1], x[2], cache)\njulia> d = HierarchicalPrior(prior_map, product_distribution([Uniform(-5.0,5.0), Uniform(0.0, 10.0)]))\njulia> x0 = rand(d)\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.MarkovRandomFieldCache-Tuple{ComradeBase.AbstractDims}","page":"Home","title":"VLBIImagePriors.MarkovRandomFieldCache","text":"MarkovRandomFieldCache(grid::AbstractDims)\n\nCreate a GMRF cache out of a Comrade model as the mean image.\n\nArguments\n\nm: Comrade model used for the mean image.\ngrid: The grid of points you want to create the model image on.\n\nKeyword arguments\n\ntransform = identity: A transform to apply to the image when creating the mean image. See the examples\n\nExample\n\njulia> m = MarkovRandomFieldCache(imagepixels(10.0, 10.0, 64, 64))\n\n\n\n\n\n","category":"method"},{"location":"#VLBIImagePriors.MarkovRandomFieldCache-Tuple{Type{<:Number}, Tuple{Int64, Int64}}","page":"Home","title":"VLBIImagePriors.MarkovRandomFieldCache","text":"MarkovRandomFieldCache(mean::AbstractMatrix)\n\nContructs the MarkovRandomFieldCache from the mean image mean. This is useful for hierarchical priors where you change the hyperparameters of the GaussMarkovRandomField, λ and Σ.\n\n\n\n\n\n","category":"method"},{"location":"#VLBIImagePriors.SphericalUnitVector","page":"Home","title":"VLBIImagePriors.SphericalUnitVector","text":"SphericalUnitVector{N}()\n\nA transformation from a set of N+1 vectors to the N sphere. The set of N+1 vectors are inherently assumed to be N+1 a distributed according to a unit multivariate Normal distribution.\n\nNotes\n\nFor more information about this transformation see the Stan manual. In the future this may be depricated when  is merged.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.TDistMarkovRandomField","page":"Home","title":"VLBIImagePriors.TDistMarkovRandomField","text":"struct TDistMarkovRandomField{T, M<:AbstractArray{T, 2}, P, C, TDi} <: VLBIImagePriors.MarkovRandomField\n\nA image prior based off of the first-order Multivariate T distribution Markov random field.\n\nFields\n\nm\nThe mean image of the TDist Markov random field\n\nλ\nThe inverse correlation length of the random field.\n\nΣ\nThe variance of the random field\n\nν\nThe student T \"degrees of freedom parameter which > 1\n\ncache\nThe Markov Random Field cache used to define the specific Markov random field class used.\n\ndims\nThe dimensions of the image.\n\nExamples\n\njulia> mimg = zeros(6, 6) # The mean image\njulia> λ, Σ = 2.0, 1.0\njulia> d = TDistMarkovRandomField(mimg, λ, Σ)\njulia> cache = MarkovRandomFieldCache(mimg) # now instead construct the cache\njulia> d2 = TDistMarkovRandomField(mimg, λ, Σ, cache)\njulia> invcov(d) ≈ invcov(d2)\ntrue\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.TDistMarkovRandomField-Tuple{AbstractMatrix, Any, Any, Any, MarkovRandomFieldCache}","page":"Home","title":"VLBIImagePriors.TDistMarkovRandomField","text":"TDistMarkovRandomField(mean::AbstractMatrix, λ, Σ, cache::MarkovRandomFieldCache)\n\nConstructs a first order TDist Markov random field with mean image mean and inverse correlation λ and diagonal covariance Σ and the precomputed MarkovRandomFieldCache cache.\n\n\n\n\n\n","category":"method"},{"location":"#VLBIImagePriors.TDistMarkovRandomField-Tuple{AbstractMatrix, Any, Any, Any}","page":"Home","title":"VLBIImagePriors.TDistMarkovRandomField","text":"TDistMarkovRandomField(mean::AbstractMatrix, λ, Σ)\n\nConstructs a first order TDist Markov random field with mean image mean and inverse correlation λ and diagonal covariance Σ.\n\n\n\n\n\n","category":"method"},{"location":"#VLBIImagePriors.TDistMarkovRandomField-Tuple{ComradeBase.AbstractModel, ComradeBase.AbstractDims, Vararg{Any}}","page":"Home","title":"VLBIImagePriors.TDistMarkovRandomField","text":"TDistMarkovRandomField(mean::ComradeBase.AbstractModel, grid::ComradeBase.AbstractDims, λ, Σ [,cache]; transform=identity)\n\nCreate a TDistMarkovRandomField object using a ComradeBase model.\n\nArguments\n\nmean: A ComradeBase model that will define the mean image\ngrid: The grid on which the image of the model will be created. This calls ComradeBase.intensitymap.\nλ: The inverse correlation length of the GMRF\nΣ: The variance of the GMRF\ncache: Optionally specify the precomputed MarkovRandomFieldCache\n\nKeyword Arguments\n\ntransform = identity: A transform to apply to the image when creating the mean image. See the examples.\n\nExamples\n\njulia> m1 = TDistMarkovRandomField(TDist(), imagepixels(10.0, 10.0, 128, 128), 5.0, 1.0; transform=alr)\njulia> cache = MarkovRandomFieldCache(TDist(), imagepixels(10.0, 10.0, 128, 128), 5.0, 1.0; transform=alr)\njulia> m2 = TDistMarkovRandomField(TDist(), imagepixels(10.0, 10.0, 128, 128), 5.0, 1.0, cache; transform=alr)\njulia> m1 == m2\ntrue\n\n\n\n\n\n","category":"method"},{"location":"#VLBIImagePriors.WrappedUniform","page":"Home","title":"VLBIImagePriors.WrappedUniform","text":"WrappedUniform(period)\n\nConstructs a potentially multivariate uniform distribution that is wrapped a given period. That is\n\nd = WrappedUniform(period)\nlogpdf(d, x) ≈ logpdf(d, x+period)\n\nfor any x.\n\nIf period is a vector this creates a multivariate independent wrapped uniform distribution.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.alr!-Tuple{Any, Any}","page":"Home","title":"VLBIImagePriors.alr!","text":"alr!(x, y)\n\nCompute the inverse alr transform. That is x lives in ℜⁿ and y, lives in Δⁿ\n\n\n\n\n\n","category":"method"},{"location":"#VLBIImagePriors.alrinv!-Tuple{Any, Any}","page":"Home","title":"VLBIImagePriors.alrinv!","text":"alrinv!(x, y)\n\nComputes the additive logit transform inplace. This converts from ℜⁿ → Δⁿ where Δⁿ is the n-simplex\n\nNotes\n\nThis function is mainly to transform the GaussMarkovRandomField to live on the simplex. In order to preserve the nice properties of the GRMF namely the log det we only use y[begin:end-1] elements and the last one is not included in the transform. This shouldn't be a problem since the additional parameter is just a dummy in that case and the Gaussian prior should ensure it is easy to sample from.\n\n\n\n\n\n","category":"method"},{"location":"#VLBIImagePriors.clr!-Tuple{Any, Any}","page":"Home","title":"VLBIImagePriors.clr!","text":"clr!(x, y)\n\nCompute the inverse alr transform. That is x lives in ℜⁿ and y, lives in Δⁿ\n\n\n\n\n\n","category":"method"},{"location":"#VLBIImagePriors.clrinv!-Tuple{Any, Any}","page":"Home","title":"VLBIImagePriors.clrinv!","text":"clrinv!(x, y)\n\nComputes the additive logit transform inplace. This converts from ℜⁿ → Δⁿ where Δⁿ is the n-simplex\n\nNotes\n\nThis function is mainly to transform the GaussMarkovRandomField to live on the simplex.\n\n\n\n\n\n","category":"method"}]
}